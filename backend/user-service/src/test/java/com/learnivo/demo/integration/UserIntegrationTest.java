package com.learnivo.demo.integration;

import com.learnivo.demo.dto.auth.AuthResponse;
import com.learnivo.demo.dto.auth.RegisterRequest;
import com.learnivo.demo.enums.Role;
import com.learnivo.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DisplayName("User – Integration Tests")
public class UserIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private TicketMessageRepository ticketMessageRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EventRepository eventRepository;

    @BeforeEach
    void setUp() {
        ticketMessageRepository.deleteAll();
        supportTicketRepository.deleteAll();
        profileRepository.deleteAll();
        verificationTokenRepository.deleteAll();
        eventRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Register user integration test")
    void registerUser_success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("integration@test.com");
        request.setPassword("password123");
        request.setRole(Role.STUDENT);

        ResponseEntity<AuthResponse> response = restTemplate.postForEntity("/api/auth/register", request, AuthResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getEmail()).isEqualTo("integration@test.com");
        assertThat(userRepository.existsByEmail("integration@test.com")).isTrue();
    }
}
