package com.esprit.quizservice.service;

import com.esprit.quizservice.dto.QuizDtos.DifficultyShareResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizAnalyticsResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizQuestionResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizResponse;
import com.esprit.quizservice.entity.Quiz;
import com.esprit.quizservice.entity.QuizQuestion;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class QuizMapper {

    QuizResponse toResponse(Quiz quiz) {
        return new QuizResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getCourse(),
                quiz.getCategory(),
                formatLabel(quiz.getDifficulty().name()),
                quiz.getQuestions(),
                quiz.getDuration(),
                quiz.getPassScore(),
                formatLabel(quiz.getStatus().name()),
                quiz.getItems().stream().map(this::toQuestionResponse).toList(),
                quiz.getCreatedAt(),
                quiz.getUpdatedAt()
        );
    }

    void updateEntity(Quiz quiz, QuizRequest request) {
        quiz.setTitle(request.title().trim());
        quiz.setCourse(request.course().trim());
        quiz.setCategory(request.category().trim());
        quiz.setDifficulty(request.difficulty());
        quiz.setQuestions(request.items().size());
        quiz.setDuration(request.duration().trim());
        quiz.setPassScore(request.passScore());
        quiz.setStatus(request.status());
        quiz.getItems().clear();

        for (var itemRequest : request.items()) {
            QuizQuestion item = new QuizQuestion();
            item.setQuiz(quiz);
            item.setQuestionKey(itemRequest.id().trim());
            item.setText(itemRequest.text().trim());
            item.setOptionOne(itemRequest.options().get(0).trim());
            item.setOptionTwo(itemRequest.options().get(1).trim());
            item.setOptionThree(itemRequest.options().get(2).trim());
            item.setOptionFour(itemRequest.options().get(3).trim());
            item.setCorrectAnswer(itemRequest.correctAnswer());
            item.setExplanation(itemRequest.explanation().trim());
            quiz.getItems().add(item);
        }
    }

    QuizAnalyticsResponse toAnalytics(long total, long published, long draft, long archived, double averageQuestions, Map<String, Long> difficultyCounts) {
        List<DifficultyShareResponse> difficulties = difficultyCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new DifficultyShareResponse(
                        formatLabel(entry.getKey()),
                        entry.getValue(),
                        total == 0 ? 0 : round((entry.getValue() * 100.0) / total)
                ))
                .toList();

        return new QuizAnalyticsResponse(total, published, draft, archived, round(averageQuestions), difficulties);
    }

    private QuizQuestionResponse toQuestionResponse(QuizQuestion item) {
        return new QuizQuestionResponse(
                item.getId(),
                item.getQuestionKey(),
                item.getText(),
                List.of(item.getOptionOne(), item.getOptionTwo(), item.getOptionThree(), item.getOptionFour()),
                item.getCorrectAnswer(),
                item.getExplanation()
        );
    }

    private String formatLabel(String value) {
        String lower = value.toLowerCase().replace('_', ' ');
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
