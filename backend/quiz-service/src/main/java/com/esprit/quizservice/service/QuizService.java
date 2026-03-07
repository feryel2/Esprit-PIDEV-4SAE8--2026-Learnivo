package com.esprit.quizservice.service;

import com.esprit.quizservice.domain.QuizStatus;
import com.esprit.quizservice.dto.QuizDtos.QuizAnalyticsResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizAttemptRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizAttemptResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizQuestionReview;
import com.esprit.quizservice.dto.QuizDtos.QuizRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizResponse;
import com.esprit.quizservice.entity.Quiz;
import com.esprit.quizservice.exception.BadRequestException;
import com.esprit.quizservice.exception.NotFoundException;
import com.esprit.quizservice.repository.QuizRepository;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizMapper quizMapper;

    public QuizService(QuizRepository quizRepository, QuizMapper quizMapper) {
        this.quizRepository = quizRepository;
        this.quizMapper = quizMapper;
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> findAll(String search, QuizStatus status, String difficulty, String category, String course) {
        String query = normalize(search);
        String normalizedDifficulty = normalize(difficulty);
        String normalizedCategory = normalize(category);
        String normalizedCourse = normalize(course);

        return quizRepository.findAll().stream()
                .filter(quiz -> query.isBlank()
                        || contains(quiz.getTitle(), query)
                        || contains(quiz.getCourse(), query)
                        || contains(quiz.getCategory(), query))
                .filter(quiz -> status == null || quiz.getStatus() == status)
                .filter(quiz -> normalizedDifficulty.isBlank() || quiz.getDifficulty().name().equalsIgnoreCase(normalizedDifficulty.replace(' ', '_')))
                .filter(quiz -> normalizedCategory.isBlank() || quiz.getCategory().equalsIgnoreCase(normalizedCategory))
                .filter(quiz -> normalizedCourse.isBlank() || quiz.getCourse().equalsIgnoreCase(normalizedCourse))
                .sorted(Comparator.comparing(Quiz::getUpdatedAt).reversed())
                .map(quizMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuizResponse findById(Long id) {
        return quizMapper.toResponse(load(id));
    }

    @Transactional(readOnly = true)
    public QuizResponse findPublishedByCourse(String courseTitle) {
        return quizRepository.findFirstByCourseIgnoreCaseAndStatusOrderByUpdatedAtDesc(courseTitle, QuizStatus.PUBLISHED)
                .map(quizMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Published quiz not found for course: " + courseTitle));
    }

    public QuizResponse create(QuizRequest request) {
        validate(request);
        Quiz quiz = new Quiz();
        quizMapper.updateEntity(quiz, request);
        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    public QuizResponse update(Long id, QuizRequest request) {
        validate(request);
        Quiz quiz = load(id);
        quizMapper.updateEntity(quiz, request);
        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    public QuizResponse updateStatus(Long id, QuizStatus status) {
        Quiz quiz = load(id);
        quiz.setStatus(status);
        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    public QuizResponse toggleStatus(Long id) {
        Quiz quiz = load(id);
        QuizStatus next = switch (quiz.getStatus()) {
            case DRAFT -> QuizStatus.PUBLISHED;
            case PUBLISHED -> QuizStatus.ARCHIVED;
            case ARCHIVED -> QuizStatus.DRAFT;
        };
        quiz.setStatus(next);
        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    public void delete(Long id) {
        quizRepository.delete(load(id));
    }

    public long renameCourseTitle(String previousTitle, String nextTitle) {
        List<Quiz> quizzes = quizRepository.findAll().stream()
                .filter(quiz -> quiz.getCourse().equalsIgnoreCase(previousTitle))
                .toList();

        quizzes.forEach(quiz -> quiz.setCourse(nextTitle.trim()));
        quizRepository.saveAll(quizzes);
        return quizzes.size();
    }

    public long deleteByCourseTitle(String courseTitle) {
        List<Quiz> quizzes = quizRepository.findAll().stream()
                .filter(quiz -> quiz.getCourse().equalsIgnoreCase(courseTitle))
                .toList();

        quizRepository.deleteAll(quizzes);
        return quizzes.size();
    }

    @Transactional(readOnly = true)
    public QuizAnalyticsResponse analytics() {
        List<Quiz> quizzes = quizRepository.findAll();
        long total = quizzes.size();
        long published = quizzes.stream().filter(quiz -> quiz.getStatus() == QuizStatus.PUBLISHED).count();
        long draft = quizzes.stream().filter(quiz -> quiz.getStatus() == QuizStatus.DRAFT).count();
        long archived = quizzes.stream().filter(quiz -> quiz.getStatus() == QuizStatus.ARCHIVED).count();
        double averageQuestions = quizzes.stream().mapToInt(Quiz::getQuestions).average().orElse(0);
        Map<String, Long> difficulties = new LinkedHashMap<>();
        for (Quiz quiz : quizzes) {
            difficulties.merge(quiz.getDifficulty().name(), 1L, Long::sum);
        }
        return quizMapper.toAnalytics(total, published, draft, archived, averageQuestions, difficulties);
    }

    @Transactional(readOnly = true)
    public QuizAttemptResponse evaluate(Long id, QuizAttemptRequest request) {
        Quiz quiz = load(id);
        if (request.answers() == null) {
            throw new BadRequestException("Answers are required.");
        }

        List<QuizQuestionReview> review = quiz.getItems().stream()
                .map(question -> {
                    Integer selected = request.answers().get(question.getQuestionKey());
                    boolean correct = selected != null && selected.equals(question.getCorrectAnswer());
                    return new QuizQuestionReview(
                            question.getQuestionKey(),
                            question.getText(),
                            selected,
                            question.getCorrectAnswer(),
                            correct,
                            question.getExplanation()
                    );
                })
                .toList();

        long correctAnswers = review.stream().filter(QuizQuestionReview::correct).count();
        int totalQuestions = quiz.getItems().size();
        double score = totalQuestions == 0 ? 0 : Math.round((correctAnswers * 1000.0) / totalQuestions) / 10.0;
        boolean passed = score >= quiz.getPassScore();

        return new QuizAttemptResponse(correctAnswers, totalQuestions, score, passed, review);
    }

    private Quiz load(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Quiz not found with id: " + id));
    }

    private void validate(QuizRequest request) {
        if (request.items().size() != request.questions()) {
            throw new BadRequestException("The number of quiz items must match the questions field.");
        }
        long distinctIds = request.items().stream().map(item -> item.id().trim().toLowerCase(Locale.ROOT)).distinct().count();
        if (distinctIds != request.items().size()) {
            throw new BadRequestException("Each quiz question id must be unique.");
        }
    }

    private boolean contains(String value, String query) {
        return normalize(value).contains(query);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
