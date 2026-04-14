package com.learnivo.competitionservice.speech.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroqService {

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL    = "llama-3.1-8b-instant";

    @Value("${groq.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate;

    /**
     * Ask Groq to evaluate the pronunciation and return a short feedback string.
     * Falls back to a static message if the API key is missing or the call fails.
     */
    public String evaluatePronunciation(String originalText, String transcript, int score) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Groq API key not configured — using fallback feedback");
            return fallbackFeedback(score);
        }

        String prompt = buildPrompt(originalText, transcript, score);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            GroqRequest body = new GroqRequest(
                MODEL,
                List.of(new GroqMessage("user", prompt)),
                150,    // max_tokens
                0.4     // temperature
            );

            HttpEntity<GroqRequest> request = new HttpEntity<>(body, headers);
            ResponseEntity<GroqResponse> response = restTemplate.postForEntity(
                GROQ_URL, request, GroqResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful()
                    && response.getBody() != null
                    && !response.getBody().getChoices().isEmpty()) {
                return response.getBody().getChoices().get(0).getMessage().getContent().trim();
            }
        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage());
        }

        return fallbackFeedback(score);
    }

    // ── Prompt ────────────────────────────────────────────────────────────────
    private String buildPrompt(String original, String transcript, int score) {
        return String.format("""
            You are a friendly English pronunciation coach.

            The student was asked to read this sentence:
            "%s"

            What we understood from their speech:
            "%s"

            Similarity score: %d/100

            Give a short evaluation (2-3 sentences max). Be encouraging and specific:
            - Mention what was correct
            - Point out specific words that need improvement (if any)
            - Give one practical tip

            Reply in plain text, no bullet points, no markdown.
            """, original, transcript, score);
    }

    private String fallbackFeedback(int score) {
        if (score >= 90) return "Outstanding! Your pronunciation is excellent. Keep it up!";
        if (score >= 75) return "Great job! Only a few minor mistakes. Almost perfect!";
        if (score >= 60) return "Good effort! A few words need improvement. Practice makes perfect.";
        if (score >= 40) return "Fair attempt. Focus on clarity and try to speak more slowly.";
        return "Keep practicing! Try to speak each word clearly and at a steady pace.";
    }

    // ── Groq API DTOs ─────────────────────────────────────────────────────────
    record GroqRequest(
        String model,
        List<GroqMessage> messages,
        @JsonProperty("max_tokens") int maxTokens,
        double temperature
    ) {}

    record GroqMessage(String role, String content) {}

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class GroqResponse {
        private List<Choice> choices;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        static class Choice {
            private GroqMessageContent message;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        static class GroqMessageContent {
            private String content;
        }
    }
}
