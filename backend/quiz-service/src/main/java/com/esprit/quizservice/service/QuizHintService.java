package com.esprit.quizservice.service;

import com.esprit.quizservice.config.QuizAiProperties;
import com.esprit.quizservice.domain.QuizDifficulty;
import com.esprit.quizservice.dto.QuizDtos.QuizHintRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizHintResponse;
import com.esprit.quizservice.entity.Quiz;
import com.esprit.quizservice.entity.QuizQuestion;
import com.esprit.quizservice.exception.BadRequestException;
import com.esprit.quizservice.exception.NotFoundException;
import com.esprit.quizservice.repository.QuizRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class QuizHintService {

    private static final int MAX_HINTS = 3;
    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how",
            "in", "is", "it", "of", "on", "or", "the", "to", "what", "when", "where",
            "which", "who", "why", "with", "this", "that", "these", "those", "into",
            "their", "there", "your", "about", "than", "does", "using", "used"
    );
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9 ]");
    private static final Pattern MULTIPLE_SPACES = Pattern.compile("\\s+");

    private final QuizRepository quizRepository;
    private final QuizAiProperties quizAiProperties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public QuizHintService(QuizRepository quizRepository, QuizAiProperties quizAiProperties, ObjectMapper objectMapper) {
        this.quizRepository = quizRepository;
        this.quizAiProperties = quizAiProperties;
        this.objectMapper = objectMapper;
        Duration timeout = quizAiProperties.timeout() == null ? Duration.ofSeconds(5) : quizAiProperties.timeout();
        this.httpClient = HttpClient.newBuilder().connectTimeout(timeout).build();
    }

    public QuizHintResponse generateHint(Long quizId, QuizHintRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found with id: " + quizId));
        QuizQuestion question = quiz.getItems().stream()
                .filter(item -> item.getQuestionKey().equalsIgnoreCase(request.questionId()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Question not found with id: " + request.questionId()));

        validateUserAnswer(request.userAnswer());
        validateHintEligibility(quiz, question);

        HintResult generated = generateRemoteHint(quiz, question, request)
                .orElseGet(() -> new HintResult(buildLocalHint(quiz, question, request), "LOCAL_FALLBACK"));

        return new QuizHintResponse(
                quizId,
                question.getQuestionKey(),
                generated.hint(),
                request.hintLevel(),
                Math.max(0, MAX_HINTS - request.hintLevel()),
                generated.source()
        );
    }

    private Optional<HintResult> generateRemoteHint(Quiz quiz, QuizQuestion question, QuizHintRequest request) {
        if (!quizAiProperties.enabled() || isBlank(quizAiProperties.apiKey()) || isBlank(quizAiProperties.baseUrl())) {
            return Optional.empty();
        }

        try {
            OpenAiRequest payload = new OpenAiRequest(
                    quizAiProperties.model(),
                    List.of(
                            new Message("system", systemPrompt()),
                            new Message("user", userPrompt(quiz, question, request))
                    ),
                    0.4
            );

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(trimTrailingSlash(quizAiProperties.baseUrl()) + "/chat/completions"))
                    .timeout(quizAiProperties.timeout() == null ? Duration.ofSeconds(5) : quizAiProperties.timeout())
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + quizAiProperties.apiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Optional.empty();
            }

            OpenAiResponse parsed = objectMapper.readValue(response.body(), OpenAiResponse.class);
            return parsed.firstMessage()
                    .map(this::normalizeHint)
                    .filter(hint -> !hint.isBlank())
                    .map(hint -> new HintResult(hint, "AI"));
        } catch (IOException | InterruptedException | IllegalArgumentException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return Optional.empty();
        }
    }

    private String buildLocalHint(Quiz quiz, QuizQuestion question, QuizHintRequest request) {
        String questionKeywords = extractKeywords(question.getText());
        String correctOption = optionAt(question, question.getCorrectAnswer());
        String sanitizedExplanation = sanitizeExplanation(question.getExplanation(), correctOption);
        String learnerChoice = request.userAnswer() == null ? "" : optionAt(question, request.userAnswer());
        boolean wrongAttempt = request.userAnswer() != null && !request.userAnswer().equals(question.getCorrectAnswer());
        String difficulty = formatLabel((question.getDifficulty() == null ? quiz.getDifficulty() : question.getDifficulty()).name());

        return switch (request.hintLevel()) {
            case 1 -> {
                if (wrongAttempt) {
                    yield "Focus on the concept behind \"" + questionKeywords + "\". Your previous choice is too far from the main idea being tested.";
                }
                yield "Start by identifying the key concept behind \"" + questionKeywords + "\" and ignore answers that feel too generic or off-topic.";
            }
            case 2 -> {
                if (wrongAttempt && !learnerChoice.isBlank()) {
                    yield "Your previous choice \"" + learnerChoice + "\" does not align with the " + difficulty.toLowerCase(Locale.ROOT)
                            + " concept targeted here. Re-read the question and eliminate answers that describe a different purpose.";
                }
                yield "Eliminate any option that does not match the exact purpose asked in the question. A strong clue is: " + sanitizedExplanation;
            }
            case 3 -> "The correct answer is the option best connected to this idea: " + sanitizedExplanation
                    + " Use that clue to compare the four choices without looking for an exact word match.";
            default -> throw new BadRequestException("Hint level must be between 1 and 3.");
        };
    }

    private String sanitizeExplanation(String explanation, String correctOption) {
        String safeExplanation = explanation == null ? "" : explanation.trim();
        if (safeExplanation.isBlank()) {
            return "look for the option that matches the precise definition or purpose in the question.";
        }

        safeExplanation = safeExplanation.replaceAll("(?i)correct answer", "best clue");
        if (!correctOption.isBlank()) {
            safeExplanation = safeExplanation.replace(correctOption, "the best-matching idea");
            safeExplanation = safeExplanation.replace(correctOption.toLowerCase(Locale.ROOT), "the best-matching idea");
            safeExplanation = safeExplanation.replace(correctOption.toUpperCase(Locale.ROOT), "the best-matching idea");
        }

        if (safeExplanation.length() > 180) {
            safeExplanation = safeExplanation.substring(0, 180).trim() + "...";
        }
        return safeExplanation;
    }

    private String extractKeywords(String text) {
        if (text == null || text.isBlank()) {
            return "the question";
        }

        String normalized = MULTIPLE_SPACES.matcher(
                NON_ALPHANUMERIC.matcher(text.toLowerCase(Locale.ROOT)).replaceAll(" ")
        ).replaceAll(" ").trim();

        List<String> ranked = List.of(normalized.split(" ")).stream()
                .filter(token -> token.length() > 2)
                .filter(token -> !STOP_WORDS.contains(token))
                .distinct()
                .sorted(Comparator.comparingInt(String::length).reversed())
                .limit(3)
                .toList();

        if (ranked.isEmpty()) {
            return text.trim();
        }
        return String.join(", ", ranked);
    }

    private String systemPrompt() {
        return """
                You generate short study hints for quiz questions.
                Rules:
                - Never reveal the correct answer directly.
                - Never quote the correct option verbatim.
                - Give a concise hint in 1 or 2 sentences.
                - If the learner already tried an answer, explain why to rethink without saying the solution.
                - Keep the tone supportive and clear.
                """;
    }

    private String userPrompt(Quiz quiz, QuizQuestion question, QuizHintRequest request) {
        QuizDifficulty difficulty = question.getDifficulty() == null ? quiz.getDifficulty() : question.getDifficulty();
        List<String> options = List.of(
                question.getOptionOne(),
                question.getOptionTwo(),
                question.getOptionThree(),
                question.getOptionFour()
        );
        Set<String> lines = new LinkedHashSet<>();
        lines.add("Quiz title: " + quiz.getTitle());
        lines.add("Course: " + quiz.getCourse());
        lines.add("Difficulty: " + formatLabel(difficulty.name()));
        lines.add("Question: " + question.getText());
        lines.add("Options: " + options);
        lines.add("Explanation for teachers only: " + question.getExplanation());
        lines.add("Hint level requested: " + request.hintLevel());
        if (request.userAnswer() != null) {
            lines.add("Learner previous answer: " + optionAt(question, request.userAnswer()));
        }
        lines.add("Return only the hint text.");
        return String.join("\n", lines);
    }

    private void validateUserAnswer(Integer userAnswer) {
        if (userAnswer != null && (userAnswer < 0 || userAnswer > 3)) {
            throw new BadRequestException("User answer must be between 0 and 3.");
        }
    }

    private void validateHintEligibility(Quiz quiz, QuizQuestion question) {
        int effectiveWeight = question.getWeight() == null
                ? weightFor(question.getDifficulty() == null ? quiz.getDifficulty() : question.getDifficulty())
                : question.getWeight();
        if (effectiveWeight != 3) {
            throw new BadRequestException("Hints are available only for weight 3 questions.");
        }
    }

    private int weightFor(QuizDifficulty difficulty) {
        QuizDifficulty safeDifficulty = difficulty == null ? QuizDifficulty.BEGINNER : difficulty;
        return switch (safeDifficulty) {
            case BEGINNER -> 1;
            case INTERMEDIATE -> 2;
            case ADVANCED -> 3;
        };
    }

    private String optionAt(QuizQuestion question, Integer index) {
        if (index == null) {
            return "";
        }
        return switch (index) {
            case 0 -> question.getOptionOne();
            case 1 -> question.getOptionTwo();
            case 2 -> question.getOptionThree();
            case 3 -> question.getOptionFour();
            default -> throw new BadRequestException("Answer index must be between 0 and 3.");
        };
    }

    private String formatLabel(String value) {
        String lower = value.toLowerCase(Locale.ROOT).replace('_', ' ');
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }

    private String normalizeHint(String hint) {
        return hint == null ? "" : hint.replace("\"", "").trim();
    }

    private String trimTrailingSlash(String baseUrl) {
        return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isBlank();
    }

    private record HintResult(String hint, String source) {
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
}
