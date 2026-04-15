package com.esprit.quizservice;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
        "app.security.enabled=true",
        "eureka.client.enabled=false"
})
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class QuizServiceSecurityTests {

    private static final String JWT_SECRET = "VGhpcy1pcy1hLXRlc3QtbGVhcm5pdm8tand0LXNlY3JldC1rZXktdGhhdC1pcy1sb25nLWVub3VnaC0xMjM0NTY3ODkw";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldRequireAuthenticationForHintGeneration() throws Exception {
        mockMvc.perform(post("/api/quizzes/1/hint")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "questionId": "fluency-1",
                                  "hintLevel": 1
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowStudentToGenerateHint() throws Exception {
        mockMvc.perform(post("/api/quizzes/1/hint")
                        .header("Authorization", "Bearer " + tokenFor("student@learnivo.local", "STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "questionId": "fluency-1",
                                  "hintLevel": 1
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldForbidStudentFromCreatingQuiz() throws Exception {
        mockMvc.perform(post("/api/quizzes")
                        .header("Authorization", "Bearer " + tokenFor("student@learnivo.local", "STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validQuizPayload()))
                .andExpect(status().isForbidden());
    }

    private String tokenFor(String subject, String role) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET));
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(3600)))
                .signWith(key)
                .compact();
    }

    private String validQuizPayload() {
        return """
                {
                  "title": "Secure Quiz Authoring",
                  "course": "Secure API Design Fundamentals",
                  "category": "Security",
                  "difficulty": "INTERMEDIATE",
                  "questions": 3,
                  "duration": "10 min",
                  "passScore": 75,
                  "status": "PUBLISHED",
                  "publishAt": "2026-04-01T08:00:00Z",
                  "items": [
                    {
                      "id": "secure-1",
                      "text": "Question 1",
                      "options": ["A", "B", "C", "D"],
                      "correctAnswer": 0,
                      "explanation": "Explanation 1",
                      "difficulty": "BEGINNER",
                      "weight": 1
                    },
                    {
                      "id": "secure-2",
                      "text": "Question 2",
                      "options": ["A", "B", "C", "D"],
                      "correctAnswer": 1,
                      "explanation": "Explanation 2",
                      "difficulty": "INTERMEDIATE",
                      "weight": 2
                    },
                    {
                      "id": "secure-3",
                      "text": "Question 3",
                      "options": ["A", "B", "C", "D"],
                      "correctAnswer": 2,
                      "explanation": "Explanation 3",
                      "difficulty": "ADVANCED",
                      "weight": 3
                    }
                  ]
                }
                """;
    }
}
