package com.esprit.courseservice.service;

import com.esprit.courseservice.dto.QuizSyncDtos.CourseRenameRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class QuizServiceClient {

    private static final Logger log = LoggerFactory.getLogger(QuizServiceClient.class);

    private final WebClient webClient;

    public QuizServiceClient(@Value("${quiz.service.base-url}") String quizServiceBaseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(quizServiceBaseUrl)
                .build();
    }

    public void renameCourse(String previousTitle, String nextTitle) {
        try {
            webClient.patch()
                    .uri("/api/quizzes/sync/course-title")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(new CourseRenameRequest(previousTitle, nextTitle))
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (RuntimeException exception) {
            log.warn("Failed to sync quiz course title from '{}' to '{}': {}", previousTitle, nextTitle, exception.getMessage());
        }
    }

    public void deleteByCourseTitle(String courseTitle) {
        try {
            webClient.delete()
                    .uri(uriBuilder -> uriBuilder.path("/api/quizzes/sync/by-course").queryParam("courseTitle", courseTitle).build())
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (RuntimeException exception) {
            log.warn("Failed to delete quizzes for course '{}': {}", courseTitle, exception.getMessage());
        }
    }
}
