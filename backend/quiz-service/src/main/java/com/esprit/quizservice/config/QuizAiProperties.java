package com.esprit.quizservice.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.ai.quiz-hints")
public record QuizAiProperties(
        boolean enabled,
        String baseUrl,
        String apiKey,
        String model,
        Duration timeout
) {
}
