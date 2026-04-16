package com.learnivo.competitionservice.speech.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnivo.competitionservice.speech.dto.SpeechEvaluateRequest;
import com.learnivo.competitionservice.speech.dto.SpeechEvaluateResponse;
import com.learnivo.competitionservice.speech.dto.SpeechSentenceDTO;
import com.learnivo.competitionservice.speech.entity.SpeechTestResult;
import com.learnivo.competitionservice.speech.service.SpeechTestService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SpeechController.class)
@DisplayName("SpeechController – WebMvc Tests")
class SpeechControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SpeechTestService speechTestService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/speech/sentence returns random sentence")
    void getRandomSentence() throws Exception {
        SpeechSentenceDTO mockSentence = new SpeechSentenceDTO(1L, "Test sentence", "EASY", "grammar");
        when(speechTestService.getRandomSentence(any())).thenReturn(mockSentence);

        mockMvc.perform(get("/api/speech/sentence?difficulty=EASY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.text").value("Test sentence"));
    }

    @Test
    @DisplayName("GET /api/speech/sentences returns all sentences")
    void getAllSentences() throws Exception {
        SpeechSentenceDTO mockSentence = new SpeechSentenceDTO(1L, "Test sentence", "EASY", "grammar");
        when(speechTestService.getAllSentences()).thenReturn(List.of(mockSentence));

        mockMvc.perform(get("/api/speech/sentences"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("POST /api/speech/evaluate evaluates user transcript")
    void evaluate() throws Exception {
        SpeechEvaluateRequest request = new SpeechEvaluateRequest();
        request.setSentenceId(1L);
        request.setTranscript("Test sentence");

        SpeechEvaluateResponse response = SpeechEvaluateResponse.builder()
                .score(90)
                .label("Excellent")
                .feedback("Good job!")
                .build();

        when(speechTestService.evaluate(any(SpeechEvaluateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/speech/evaluate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(90))
                .andExpect(jsonPath("$.label").value("Excellent"));
    }

    @Test
    @DisplayName("GET /api/speech/history/{email} returns history for user")
    void getHistory() throws Exception {
        SpeechTestResult result = new SpeechTestResult();
        result.setUserEmail("test@test.com");
        result.setScore(85);

        when(speechTestService.getHistory(anyString())).thenReturn(List.of(result));

        mockMvc.perform(get("/api/speech/history/test@test.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].userEmail").value("test@test.com"));
    }
}
