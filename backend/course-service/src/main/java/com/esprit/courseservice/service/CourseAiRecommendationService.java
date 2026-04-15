package com.esprit.courseservice.service;

import com.esprit.courseservice.config.CourseAiProperties;
import com.esprit.courseservice.domain.CourseDifficulty;
import com.esprit.courseservice.domain.CourseStatus;
import com.esprit.courseservice.domain.CourseType;
import com.esprit.courseservice.dto.CourseDtos.CourseRecommendationItem;
import com.esprit.courseservice.dto.CourseDtos.CourseRecommendationRequest;
import com.esprit.courseservice.dto.CourseDtos.CourseRecommendationResponse;
import com.esprit.courseservice.entity.Course;
import com.esprit.courseservice.exception.NotFoundException;
import com.esprit.courseservice.repository.CourseRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CourseAiRecommendationService {

    private static final int DEFAULT_LIMIT = 3;
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9 ]");
    private static final Pattern MULTIPLE_SPACES = Pattern.compile("\\s+");
    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how",
            "i", "in", "into", "is", "it", "my", "of", "on", "or", "that", "the",
            "their", "this", "to", "want", "with", "your"
    );

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final CourseDifficultyCalculator courseDifficultyCalculator;
    private final CourseAiProperties courseAiProperties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public CourseAiRecommendationService(
            CourseRepository courseRepository,
            CourseMapper courseMapper,
            CourseDifficultyCalculator courseDifficultyCalculator,
            CourseAiProperties courseAiProperties,
            ObjectMapper objectMapper
    ) {
        this.courseRepository = courseRepository;
        this.courseMapper = courseMapper;
        this.courseDifficultyCalculator = courseDifficultyCalculator;
        this.courseAiProperties = courseAiProperties;
        this.objectMapper = objectMapper;
        Duration timeout = courseAiProperties.timeout() == null ? Duration.ofSeconds(5) : courseAiProperties.timeout();
        this.httpClient = HttpClient.newBuilder().connectTimeout(timeout).build();
    }

    public CourseRecommendationResponse recommend(CourseRecommendationRequest request) {
        int limit = safeLimit(request.limit());
        Course referenceCourse = request.basedOnCourseId() == null ? null : courseRepository.findById(request.basedOnCourseId())
                .orElseThrow(() -> new NotFoundException("Course not found with id: " + request.basedOnCourseId()));
        Set<Long> completedCourseIds = request.completedCourseIds() == null ? Set.of() : new LinkedHashSet<>(request.completedCourseIds());

        List<Course> candidates = courseRepository.findAll().stream()
                .filter(course -> course.getStatus() == CourseStatus.PUBLISHED)
                .filter(course -> request.basedOnCourseId() == null || !course.getId().equals(request.basedOnCourseId()))
                .filter(course -> !completedCourseIds.contains(course.getId()))
                .peek(this::applyDifficultyMetadata)
                .toList();

        if (candidates.isEmpty()) {
            return new CourseRecommendationResponse("LOCAL_FALLBACK", "no-candidates", limit, List.of());
        }

        return generateRemoteRecommendations(request, referenceCourse, candidates, limit)
                .orElseGet(() -> buildLocalRecommendations(request, referenceCourse, candidates, limit));
    }

    private Optional<CourseRecommendationResponse> generateRemoteRecommendations(
            CourseRecommendationRequest request,
            Course referenceCourse,
            List<Course> candidates,
            int limit
    ) {
        if (!courseAiProperties.enabled() || isBlank(courseAiProperties.apiKey()) || isBlank(courseAiProperties.baseUrl())) {
            return Optional.empty();
        }

        try {
            OpenAiRequest payload = new OpenAiRequest(
                    courseAiProperties.model(),
                    List.of(
                            new Message("system", systemPrompt(limit)),
                            new Message("user", userPrompt(request, referenceCourse, candidates, limit))
                    ),
                    0.3
            );

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(trimTrailingSlash(courseAiProperties.baseUrl()) + "/chat/completions"))
                    .timeout(courseAiProperties.timeout() == null ? Duration.ofSeconds(5) : courseAiProperties.timeout())
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + courseAiProperties.apiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Optional.empty();
            }

            OpenAiResponse parsed = objectMapper.readValue(response.body(), OpenAiResponse.class);
            Optional<String> content = parsed.firstMessage().map(this::stripCodeFences);
            if (content.isEmpty() || content.get().isBlank()) {
                return Optional.empty();
            }

            RecommendationPayload recommendationPayload = objectMapper.readValue(content.get(), RecommendationPayload.class);
            Map<Long, Course> candidateById = new HashMap<>();
            for (Course course : candidates) {
                candidateById.put(course.getId(), course);
            }

            List<CourseRecommendationItem> aiItems = new ArrayList<>();
            Set<Long> seen = new LinkedHashSet<>();
            if (recommendationPayload.recommendations() != null) {
                for (RecommendationSuggestion suggestion : recommendationPayload.recommendations()) {
                    if (suggestion == null || suggestion.courseId() == null || !seen.add(suggestion.courseId())) {
                        continue;
                    }
                    Course course = candidateById.get(suggestion.courseId());
                    if (course == null) {
                        continue;
                    }
                    aiItems.add(new CourseRecommendationItem(
                            courseMapper.toResponse(course),
                            sanitizeReason(suggestion.reason(), course),
                            round(clampScore(suggestion.matchScore()))
                    ));
                    if (aiItems.size() == limit) {
                        break;
                    }
                }
            }

            if (aiItems.isEmpty()) {
                return Optional.empty();
            }

            if (aiItems.size() < limit) {
                List<CourseRecommendationItem> localItems = buildLocalRecommendations(request, referenceCourse, candidates, limit).recommendations();
                Set<Long> alreadyIncluded = aiItems.stream().map(item -> item.course().id()).collect(LinkedHashSet::new, Set::add, Set::addAll);
                for (CourseRecommendationItem localItem : localItems) {
                    if (alreadyIncluded.add(localItem.course().id())) {
                        aiItems.add(localItem);
                    }
                    if (aiItems.size() == limit) {
                        break;
                    }
                }
            }

            return Optional.of(new CourseRecommendationResponse("AI", "remote-ranking", limit, aiItems));
        } catch (IOException | InterruptedException | IllegalArgumentException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return Optional.empty();
        }
    }

    private CourseRecommendationResponse buildLocalRecommendations(
            CourseRecommendationRequest request,
            Course referenceCourse,
            List<Course> candidates,
            int limit
    ) {
        List<LocalRecommendationScore> scored = candidates.stream()
                .map(course -> scoreCourse(course, request, referenceCourse))
                .sorted(Comparator.comparingDouble(LocalRecommendationScore::score).reversed()
                        .thenComparing(item -> item.course().getUpdatedAt(), Comparator.reverseOrder()))
                .limit(limit)
                .toList();

        List<CourseRecommendationItem> recommendations = scored.stream()
                .map(item -> new CourseRecommendationItem(
                        courseMapper.toResponse(item.course()),
                        buildLocalReason(item.course(), request, referenceCourse),
                        round(item.score())
                ))
                .toList();

        return new CourseRecommendationResponse("LOCAL_FALLBACK", "rule-based-ranking", limit, recommendations);
    }

    private LocalRecommendationScore scoreCourse(Course course, CourseRecommendationRequest request, Course referenceCourse) {
        double score = 35.0;
        if (equalsIgnoreCase(course.getCategory(), request.preferredCategory())) {
            score += 28.0;
        }
        if (equalsIgnoreCase(course.getLevel(), request.preferredLevel())) {
            score += 18.0;
        }
        if (request.preferredType() != null && course.getType() == request.preferredType()) {
            score += 12.0;
        }
        if (referenceCourse != null && equalsIgnoreCase(course.getCategory(), referenceCourse.getCategory())) {
            score += 18.0;
        }
        if (referenceCourse != null && equalsIgnoreCase(course.getLevel(), referenceCourse.getLevel())) {
            score += 12.0;
        }
        if (referenceCourse != null && course.getType() == referenceCourse.getType()) {
            score += 8.0;
        }

        int keywordMatches = keywordOverlap(
                request.goal(),
                course.getTitle() + " " + course.getDescription() + " " + course.getCategory() + " " + course.getInstructor()
        );
        score += Math.min(keywordMatches * 6.0, 24.0);

        CourseDifficulty difficulty = course.getDifficultyLabel() == null ? CourseDifficulty.BEGINNER : course.getDifficultyLabel();
        if (equalsIgnoreCase(request.preferredLevel(), "beginner") && difficulty == CourseDifficulty.BEGINNER) {
            score += 4.0;
        }
        if (equalsIgnoreCase(request.preferredLevel(), "intermediate") && difficulty == CourseDifficulty.INTERMEDIATE) {
            score += 4.0;
        }
        if (equalsIgnoreCase(request.preferredLevel(), "advanced") && difficulty == CourseDifficulty.ADVANCED) {
            score += 4.0;
        }

        return new LocalRecommendationScore(course, Math.min(score, 99.0));
    }

    private String buildLocalReason(Course course, CourseRecommendationRequest request, Course referenceCourse) {
        List<String> reasons = new ArrayList<>();
        if (!isBlank(request.preferredCategory()) && equalsIgnoreCase(course.getCategory(), request.preferredCategory())) {
            reasons.add("matches your preferred category");
        }
        if (!isBlank(request.preferredLevel()) && equalsIgnoreCase(course.getLevel(), request.preferredLevel())) {
            reasons.add("fits your target level");
        }
        if (request.preferredType() != null && course.getType() == request.preferredType()) {
            reasons.add("uses your preferred learning format");
        }
        if (referenceCourse != null && equalsIgnoreCase(course.getCategory(), referenceCourse.getCategory())) {
            reasons.add("continues naturally after " + referenceCourse.getTitle());
        }

        int goalMatches = keywordOverlap(request.goal(), course.getTitle() + " " + course.getDescription());
        if (goalMatches > 0) {
            reasons.add("supports your stated learning goal");
        }

        if (reasons.isEmpty()) {
            reasons.add("offers a strong overall match based on course category, level, and content");
        }

        return sanitizeReason(String.join(", ", reasons) + ".", course);
    }

    private CourseDifficultyCalculator.DifficultyAssessment applyDifficultyMetadata(Course course) {
        CourseDifficultyCalculator.DifficultyAssessment assessment = courseDifficultyCalculator.assess(course);
        course.setDifficultyScore(assessment.score());
        course.setDifficultyLabel(assessment.label());
        return assessment;
    }

    private String systemPrompt(int limit) {
        return """
                You recommend the best learning courses for a learner profile.
                Return strict JSON only.
                Use only the candidate course IDs that are provided.
                Never invent IDs.
                Pick up to %d recommendations.
                JSON format:
                {"recommendations":[{"courseId":1,"reason":"short reason","matchScore":92}]}
                """.formatted(limit);
    }

    private String userPrompt(CourseRecommendationRequest request, Course referenceCourse, List<Course> candidates, int limit) throws IOException {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("goal", blankToNull(request.goal()));
        payload.put("preferredLevel", blankToNull(request.preferredLevel()));
        payload.put("preferredCategory", blankToNull(request.preferredCategory()));
        payload.put("preferredType", request.preferredType() == null ? null : request.preferredType().name());
        payload.put("basedOnCourse", referenceCourse == null ? null : Map.of(
                "id", referenceCourse.getId(),
                "title", referenceCourse.getTitle(),
                "category", referenceCourse.getCategory(),
                "level", referenceCourse.getLevel(),
                "type", referenceCourse.getType().name()
        ));
        payload.put("limit", limit);

        List<Map<String, Object>> candidatePayload = candidates.stream()
                .map(course -> Map.<String, Object>of(
                        "id", course.getId(),
                        "title", course.getTitle(),
                        "category", course.getCategory(),
                        "level", course.getLevel(),
                        "type", course.getType().name(),
                        "difficultyLabel", course.getDifficultyLabel() == null ? "BEGINNER" : course.getDifficultyLabel().name(),
                        "difficultyScore", course.getDifficultyScore() == null ? 0.0 : course.getDifficultyScore(),
                        "duration", course.getDuration(),
                        "description", course.getDescription()
                ))
                .toList();
        payload.put("candidates", candidatePayload);

        return objectMapper.writeValueAsString(payload);
    }

    private int safeLimit(Integer limit) {
        if (limit == null || limit < 1) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, 10);
    }

    private int keywordOverlap(String goal, String content) {
        Set<String> goalTokens = tokenize(goal);
        if (goalTokens.isEmpty()) {
            return 0;
        }
        Set<String> contentTokens = tokenize(content);
        int count = 0;
        for (String token : goalTokens) {
            if (contentTokens.contains(token)) {
                count++;
            }
        }
        return count;
    }

    private Set<String> tokenize(String value) {
        if (value == null || value.isBlank()) {
            return Set.of();
        }

        String normalized = MULTIPLE_SPACES.matcher(
                NON_ALPHANUMERIC.matcher(value.toLowerCase(Locale.ROOT)).replaceAll(" ")
        ).replaceAll(" ").trim();

        if (normalized.isBlank()) {
            return Set.of();
        }

        Set<String> tokens = new LinkedHashSet<>();
        for (String token : normalized.split(" ")) {
            if (token.length() > 2 && !STOP_WORDS.contains(token)) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private boolean equalsIgnoreCase(String left, String right) {
        return left != null && right != null && left.equalsIgnoreCase(right);
    }

    private double clampScore(Double score) {
        if (score == null || !Double.isFinite(score)) {
            return 85.0;
        }
        return Math.max(0.0, Math.min(score, 100.0));
    }

    private String sanitizeReason(String reason, Course course) {
        String safeReason = reason == null ? "" : reason.trim();
        if (safeReason.isBlank()) {
            safeReason = "Recommended because it aligns with the learner profile and course metadata.";
        }
        if (safeReason.length() > 220) {
            safeReason = safeReason.substring(0, 220).trim() + "...";
        }
        if (!safeReason.endsWith(".")) {
            safeReason += ".";
        }
        return safeReason.replace(course.getTitle(), "this course");
    }

    private String stripCodeFences(String value) {
        String trimmed = value == null ? "" : value.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("^```(?:json)?", "").replaceFirst("```$", "").trim();
        }
        return trimmed;
    }

    private String trimTrailingSlash(String baseUrl) {
        return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isBlank();
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private record LocalRecommendationScore(Course course, double score) {
    }

    private record OpenAiRequest(
            String model,
            List<Message> messages,
            double temperature
    ) {
    }

    private record Message(String role, String content) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenAiResponse(List<Choice> choices) {
        private Optional<String> firstMessage() {
            if (choices == null || choices.isEmpty() || choices.get(0).message() == null) {
                return Optional.empty();
            }
            return Optional.ofNullable(choices.get(0).message().content());
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Choice(MessageContent message) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record MessageContent(@JsonProperty("content") String content) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record RecommendationPayload(List<RecommendationSuggestion> recommendations) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record RecommendationSuggestion(Long courseId, String reason, Double matchScore) {
    }
}
