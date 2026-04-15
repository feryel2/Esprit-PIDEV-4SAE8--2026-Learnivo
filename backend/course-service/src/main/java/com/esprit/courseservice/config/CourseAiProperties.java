package com.esprit.courseservice.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.ai.course-recommendations")
public record CourseAiProperties(
        boolean enabled,
        String baseUrl,
        String apiKey,
        String model,
        Duration timeout
) {
}
