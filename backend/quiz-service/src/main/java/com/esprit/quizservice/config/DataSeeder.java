package com.esprit.quizservice.config;

import com.esprit.quizservice.domain.QuizDifficulty;
import com.esprit.quizservice.domain.QuizStatus;
import com.esprit.quizservice.dto.QuizDtos.QuizQuestionRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizRequest;
import com.esprit.quizservice.repository.QuizRepository;
import com.esprit.quizservice.service.QuizService;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedQuizzes(QuizRepository quizRepository, QuizService quizService) {
        return args -> {
            if (quizRepository.count() > 0) {
                return;
            }

            quizService.create(new QuizRequest(
                    "Fluency Checkpoint",
                    "Speak Fluent English in 30 Days - No Boring Grammar Rules!",
                    "Speaking",
                    QuizDifficulty.BEGINNER,
                    3,
                    "10 min",
                    70,
                    QuizStatus.PUBLISHED,
                    List.of(
                            new QuizQuestionRequest("fluency-1", "What is the main focus of the course?", List.of("Real-world conversation", "Silent reading only", "Coding syntax", "Translation drills only"), 0, "The course focuses on practical speaking."),
                            new QuizQuestionRequest("fluency-2", "What helps learners build consistency?", List.of("Daily speaking habits", "Avoiding feedback", "Skipping practice", "Memorizing random lists"), 0, "Consistency comes from repeated practice."),
                            new QuizQuestionRequest("fluency-3", "What score is needed to pass?", List.of("50%", "60%", "70%", "100%"), 2, "This quiz requires at least 70%.")
                    )
            ));

            quizService.create(new QuizRequest(
                    "Writing Masterclass Assessment",
                    "The Ultimate English Writing Masterclass: From Beginner to Pro!",
                    "Writing",
                    QuizDifficulty.INTERMEDIATE,
                    2,
                    "12 min",
                    75,
                    QuizStatus.DRAFT,
                    List.of(
                            new QuizQuestionRequest("writing-1", "What skill does the course improve?", List.of("Clear writing structure", "Football strategy", "Database indexing", "Graphic animation"), 0, "The course is about writing quality."),
                            new QuizQuestionRequest("writing-2", "Which format fits the duration field?", List.of("6 weeks", "15 min", "soon", "later"), 1, "Quiz durations use minute-based labels.")
                    )
            ));

            quizService.create(new QuizRequest(
                    "Accent Precision Review",
                    "Accent Makeover: Sound Like a Native in Just Weeks!",
                    "Pronunciation",
                    QuizDifficulty.ADVANCED,
                    2,
                    "15 min",
                    80,
                    QuizStatus.ARCHIVED,
                    List.of(
                            new QuizQuestionRequest("accent-1", "Which speech feature is covered?", List.of("Intonation", "Spreadsheet formulas", "Router config", "Photo filters"), 0, "The course covers intonation."),
                            new QuizQuestionRequest("accent-2", "How many options must each question include?", List.of("2", "3", "4", "5"), 2, "The frontend expects 4 options per question.")
                    )
            ));
        };
    }
}
