package com.learnivo.competitionservice.speech.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("GroqService – Unit Tests")
class GroqServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GroqService groqService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(groqService, "apiKey", "test-api-key");
    }

    @Test
    @DisplayName("evaluatePronunciation returns success message via Groq API")
    void evaluatePronunciation_success() {
        GroqService.GroqResponse mockResponse = new GroqService.GroqResponse();
        GroqService.GroqResponse.Choice choice = new GroqService.GroqResponse.Choice();
        GroqService.GroqResponse.GroqMessageContent msg = new GroqService.GroqResponse.GroqMessageContent();
        msg.setContent("Great pronunciation feedback");
        choice.setMessage(msg);
        mockResponse.setChoices(java.util.List.of(choice));

        ResponseEntity<GroqService.GroqResponse> entity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(GroqService.GroqResponse.class))).thenReturn(entity);

        String feedback = groqService.evaluatePronunciation("Hello world", "hello world", 100);

        assertThat(feedback).isEqualTo("Great pronunciation feedback");
    }

    @Test
    @DisplayName("evaluatePronunciation returns fallback when no api key")
    void evaluatePronunciation_fallback_noApiKey() {
        ReflectionTestUtils.setField(groqService, "apiKey", null);

        String feedback = groqService.evaluatePronunciation("Hello", "Hello", 95);

        assertThat(feedback).contains("Outstanding!");
    }

    @Test
    @DisplayName("evaluatePronunciation returns fallback on API error")
    void evaluatePronunciation_fallback_onApiError() {
        when(restTemplate.postForEntity(anyString(), any(), eq(GroqService.GroqResponse.class)))
                .thenThrow(new RuntimeException("API Failure"));

        String feedback = groqService.evaluatePronunciation("Fail", "Fail", 65);

        assertThat(feedback).contains("Good effort!");
    }
}
