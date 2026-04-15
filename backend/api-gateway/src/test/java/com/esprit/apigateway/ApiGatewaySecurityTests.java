package com.esprit.apigateway;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(properties = {
        "eureka.client.enabled=false",
        "app.security.enabled=true"
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class ApiGatewaySecurityTests {

    private static final String JWT_SECRET = "VGhpcy1pcy1hLWRlbW8tbGVhcm5pdm8tand0LXNlY3JldC1rZXktdGhhdC1pcy1sb25nLWVub3VnaC0xMjM0NTY3ODkw";

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void shouldRejectUnauthenticatedMeEndpoint() {
        webTestClient.get()
                .uri("/api/auth/me")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void shouldRejectUnauthenticatedLearnerRecommendationEndpoint() {
        webTestClient.post()
                .uri("/api/courses/recommendations/ai")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void shouldForbidStudentAccessToTeacherUserEndpoints() {
        webTestClient.get()
                .uri("/api/users/demo")
                .header("Authorization", "Bearer " + tokenFor("student@learnivo.local", "STUDENT"))
                .exchange()
                .expectStatus().isForbidden();
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
}
