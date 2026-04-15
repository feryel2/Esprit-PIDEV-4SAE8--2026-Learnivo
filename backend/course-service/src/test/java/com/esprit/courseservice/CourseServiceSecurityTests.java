package com.esprit.courseservice;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
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
class CourseServiceSecurityTests {

    private static final String JWT_SECRET = "VGhpcy1pcy1hLXRlc3QtbGVhcm5pdm8tand0LXNlY3JldC1rZXktdGhhdC1pcy1sb25nLWVub3VnaC0xMjM0NTY3ODkw";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldRequireAuthenticationForAiRecommendations() throws Exception {
        mockMvc.perform(post("/api/courses/recommendations/ai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "goal": "Recommend grammar courses",
                                  "limit": 2
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowStudentToRequestAiRecommendations() throws Exception {
        mockMvc.perform(post("/api/courses/recommendations/ai")
                        .header("Authorization", "Bearer " + tokenFor("student@learnivo.local", "STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "goal": "Recommend grammar courses",
                                  "preferredCategory": "Grammar",
                                  "limit": 2
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldForbidStudentFromCreatingCourse() throws Exception {
        mockMvc.perform(post("/api/courses")
                        .header("Authorization", "Bearer " + tokenFor("student@learnivo.local", "STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validCoursePayload()))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowTeacherToCreateCourse() throws Exception {
        mockMvc.perform(post("/api/courses")
                        .header("Authorization", "Bearer " + tokenFor("teacher@learnivo.local", "TEACHER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validCoursePayload()))
                .andExpect(status().isCreated());
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

    private String validCoursePayload() {
        return """
                {
                  "title": "Secure API Design Fundamentals",
                  "description": "A practical course focused on securing APIs, validating requests, and managing authorization with confidence.",
                  "type": "BLENDED_COURSE",
                  "status": "PUBLISHED",
                  "level": "Intermediate",
                  "image": "/images/training-1.jpg",
                  "banner": "/images/course-banner.jpg",
                  "instructor": "Security Mentor",
                  "category": "Security",
                  "chapters": 1,
                  "duration": "2 weeks",
                  "chaptersData": [
                    {
                      "name": "Secure Foundations",
                      "number": 1,
                      "pdfUrl": "secure-foundations.pdf",
                      "sections": [
                        { "name": "JWT basics", "completed": false }
                      ]
                    }
                  ]
                }
                """;
    }
}
