package com.learnivo.competitionservice.integration;

import com.learnivo.competitionservice.speech.entity.SpeechSentence;
import com.learnivo.competitionservice.speech.repository.SpeechSentenceRepository;
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
@DisplayName("SpeechModule – Integration Tests")
class SpeechModuleIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SpeechSentenceRepository sentenceRepository;

    @BeforeEach
    void setUp() {
        sentenceRepository.deleteAll();
        sentenceRepository.save(new SpeechSentence(null, "Test sentence one", "EASY", "grammar"));
        sentenceRepository.save(new SpeechSentence(null, "Test sentence two", "HARD", "vocabulary"));
    }

    @Test
    @DisplayName("GET /api/speech/sentences returns the seeded sentences from DB")
    void testGetAllSentences() {
        ResponseEntity<Object[]> response = restTemplate.getForEntity("/api/speech/sentences", Object[].class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(2);
    }
    
    @Test
    @DisplayName("GET /api/speech/sentence?difficulty=HARD returns a specific difficult sentence")
    void testGetRandomSentence() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/speech/sentence?difficulty=HARD", String.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("Test sentence two");
    }
}
