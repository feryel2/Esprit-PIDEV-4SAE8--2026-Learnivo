package com.esprit.quizservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.esprit.quizservice.domain.QuizDifficulty;
import com.esprit.quizservice.domain.QuizStatus;
import com.esprit.quizservice.dto.QuizDtos.QuizAttemptRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizQuestionRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizRequest;
import com.esprit.quizservice.entity.Quiz;
import com.esprit.quizservice.entity.QuizQuestion;
import com.esprit.quizservice.exception.BadRequestException;
import com.esprit.quizservice.repository.QuizRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    private QuizService quizService;

    @BeforeEach
    void setUp() {
        quizService = new QuizService(quizRepository, new QuizMapper());
    }

    @Test
    void shouldRejectPublishedQuizWithoutPublicationDate() {
        QuizRequest request = new QuizRequest(
                "Protected Quiz",
                "Secure Course",
                "Security",
                QuizDifficulty.INTERMEDIATE,
                3,
                "10 min",
                75,
                QuizStatus.PUBLISHED,
                null,
                List.of(
                        question("q1"),
                        question("q2"),
                        question("q3")
                )
        );

        BadRequestException exception = assertThrows(BadRequestException.class, () -> quizService.create(request));

        assertEquals("A published quiz must include a publication date and time.", exception.getMessage());
    }

    @Test
    void shouldRejectDuplicateQuestionIds() {
        QuizRequest request = new QuizRequest(
                "Duplicate Question Quiz",
                "Secure Course",
                "Security",
                QuizDifficulty.INTERMEDIATE,
                3,
                "10 min",
                75,
                QuizStatus.DRAFT,
                null,
                List.of(
                        question("same-id"),
                        question("same-id"),
                        question("q3")
                )
        );

        BadRequestException exception = assertThrows(BadRequestException.class, () -> quizService.create(request));

        assertEquals("Each quiz question id must be unique.", exception.getMessage());
    }

    @Test
    void shouldRejectQuestionWithDuplicateOptions() {
        QuizRequest request = new QuizRequest(
                "Duplicate Options Quiz",
                "Secure Course",
                "Security",
                QuizDifficulty.INTERMEDIATE,
                3,
                "10 min",
                75,
                QuizStatus.DRAFT,
                null,
                List.of(
                        questionWithOptions("q1", List.of("A", "A", "C", "D")),
                        question("q2"),
                        question("q3")
                )
        );

        BadRequestException exception = assertThrows(BadRequestException.class, () -> quizService.create(request));

        assertEquals("Each quiz question must contain four distinct answer options.", exception.getMessage());
    }

    @Test
    void shouldPickLatestAvailablePublishedQuizForCourse() {
        Quiz older = quiz(1L, "Older Quiz", Instant.parse("2026-04-10T10:00:00Z"));
        Quiz newer = quiz(2L, "Newer Quiz", Instant.parse("2026-04-12T10:00:00Z"));
        when(quizRepository.findAvailableByCourseAndStatus(eq("Course A"), eq(QuizStatus.PUBLISHED), any(Instant.class)))
                .thenReturn(List.of(older, newer));

        var response = quizService.findPublishedByCourse("Course A");

        assertEquals("Newer Quiz", response.title());
    }

    @Test
    void shouldArchiveOtherPublishedQuizzesForSameCourseOnCreate() {
        Quiz saved = quiz(3L, "Fresh Quiz", Instant.parse("2026-04-12T10:00:00Z"));
        saved.setStatus(QuizStatus.PUBLISHED);
        saved.setCourse("Course A");
        saved.setPublishAt(Instant.parse("2026-04-12T10:00:00Z"));

        Quiz oldPublished = quiz(1L, "Old Quiz", Instant.parse("2026-04-10T10:00:00Z"));
        oldPublished.setStatus(QuizStatus.PUBLISHED);
        oldPublished.setCourse("Course A");

        when(quizRepository.save(any(Quiz.class))).thenReturn(saved);
        when(quizRepository.findByCourseIgnoreCaseAndStatusAndIdNot("Course A", QuizStatus.PUBLISHED, 3L))
                .thenReturn(List.of(oldPublished));

        quizService.create(new QuizRequest(
                "Fresh Quiz",
                "Course A",
                "Security",
                QuizDifficulty.INTERMEDIATE,
                3,
                "10 min",
                75,
                QuizStatus.PUBLISHED,
                Instant.parse("2026-04-12T10:00:00Z"),
                List.of(question("q1"), question("q2"), question("q3"))
        ));

        assertEquals(QuizStatus.ARCHIVED, oldPublished.getStatus());
        verify(quizRepository).saveAll(List.of(oldPublished));
    }

    @Test
    void shouldNotArchiveOtherQuizzesWhenCurrentQuizIsNotYetAvailable() {
        Quiz saved = quiz(3L, "Future Quiz", Instant.parse("2099-01-01T10:00:00Z"));
        saved.setStatus(QuizStatus.PUBLISHED);
        saved.setCourse("Course A");
        saved.setPublishAt(Instant.parse("2099-01-01T10:00:00Z"));

        when(quizRepository.save(any(Quiz.class))).thenReturn(saved);

        quizService.create(new QuizRequest(
                "Future Quiz",
                "Course A",
                "Security",
                QuizDifficulty.INTERMEDIATE,
                3,
                "10 min",
                75,
                QuizStatus.PUBLISHED,
                Instant.parse("2099-01-01T10:00:00Z"),
                List.of(question("q1"), question("q2"), question("q3"))
        ));

        verify(quizRepository, never()).saveAll(any());
    }

    @Test
    void shouldUseQuizDifficultyWeightAsFallbackDuringEvaluation() {
        Quiz quiz = new Quiz();
        quiz.setId(5L);
        quiz.setTitle("Fallback Weight Quiz");
        quiz.setCourse("Architecture");
        quiz.setCategory("Security");
        quiz.setDifficulty(QuizDifficulty.ADVANCED);
        quiz.setQuestions(3);
        quiz.setDuration("15 min");
        quiz.setPassScore(70);
        quiz.setStatus(QuizStatus.PUBLISHED);

        QuizQuestion question = new QuizQuestion();
        question.setQuestionKey("q1");
        question.setText("Question");
        question.setCorrectAnswer(2);
        question.setExplanation("Explanation");
        question.setDifficulty(null);
        question.setWeight(null);
        question.setQuiz(quiz);
        quiz.setItems(List.of(question));

        when(quizRepository.findById(5L)).thenReturn(Optional.of(quiz));

        var response = quizService.evaluate(5L, new QuizAttemptRequest(Map.of("q1", 2)));

        assertEquals(3, response.totalWeight());
        assertEquals(3, response.earnedWeight());
        assertEquals(100.0, response.score());
        assertTrue(response.passed());
        assertEquals("Advanced", response.review().get(0).difficulty());
    }

    @Test
    void shouldRenameCourseTitleAcrossAllMatchingQuizzes() {
        Quiz first = quiz(1L, "Quiz One", Instant.parse("2026-04-10T10:00:00Z"));
        first.setCourse("Old Course");
        Quiz second = quiz(2L, "Quiz Two", Instant.parse("2026-04-11T10:00:00Z"));
        second.setCourse("Old Course");

        when(quizRepository.findByCourseIgnoreCase("Old Course")).thenReturn(List.of(first, second));

        long updatedCount = quizService.renameCourseTitle("Old Course", "New Course");

        assertEquals(2, updatedCount);
        assertEquals("New Course", first.getCourse());
        assertEquals("New Course", second.getCourse());
        verify(quizRepository).saveAll(List.of(first, second));
    }

    private QuizQuestionRequest question(String id) {
        return questionWithOptions(id, List.of("A", "B", "C", "D"));
    }

    private QuizQuestionRequest questionWithOptions(String id, List<String> options) {
        return new QuizQuestionRequest(
                id,
                "What is the right answer for " + id + "?",
                options,
                1,
                "Because this is the expected answer.",
                null,
                null
        );
    }

    private Quiz quiz(Long id, String title, Instant updatedAt) {
        Quiz quiz = new Quiz();
        quiz.setId(id);
        quiz.setTitle(title);
        quiz.setCourse("Course A");
        quiz.setCategory("Security");
        quiz.setDifficulty(QuizDifficulty.INTERMEDIATE);
        quiz.setQuestions(3);
        quiz.setDuration("10 min");
        quiz.setPassScore(75);
        quiz.setStatus(QuizStatus.PUBLISHED);
        quiz.setPublishAt(Instant.parse("2026-04-01T10:00:00Z"));
        quiz.setUpdatedAt(updatedAt);
        quiz.setCreatedAt(updatedAt.minusSeconds(3600));
        quiz.setItems(List.of(questionEntity(quiz, "q1"), questionEntity(quiz, "q2"), questionEntity(quiz, "q3")));
        return quiz;
    }

    private QuizQuestion questionEntity(Quiz quiz, String id) {
        QuizQuestion question = new QuizQuestion();
        question.setQuiz(quiz);
        question.setQuestionKey(id);
        question.setText("Question " + id);
        question.setOptionOne("A");
        question.setOptionTwo("B");
        question.setOptionThree("C");
        question.setOptionFour("D");
        question.setCorrectAnswer(1);
        question.setExplanation("Explanation");
        question.setDifficulty(QuizDifficulty.INTERMEDIATE);
        question.setWeight(2);
        return question;
    }
}
