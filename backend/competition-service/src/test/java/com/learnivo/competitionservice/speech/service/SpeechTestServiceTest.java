package com.learnivo.competitionservice.speech.service;

import com.learnivo.competitionservice.speech.dto.SpeechEvaluateRequest;
import com.learnivo.competitionservice.speech.dto.SpeechEvaluateResponse;
import com.learnivo.competitionservice.speech.dto.SpeechSentenceDTO;
import com.learnivo.competitionservice.speech.entity.SpeechSentence;
import com.learnivo.competitionservice.speech.entity.SpeechTestResult;
import com.learnivo.competitionservice.speech.repository.SpeechSentenceRepository;
import com.learnivo.competitionservice.speech.repository.SpeechTestResultRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SpeechTestService – Unit Tests")
class SpeechTestServiceTest {

    @Mock
    private GroqService groqService;

    @Mock
    private SpeechSentenceRepository sentenceRepo;

    @Mock
    private SpeechTestResultRepository resultRepo;

    @InjectMocks
    private SpeechTestService speechTestService;

    private SpeechSentence mockSentence;

    @BeforeEach
    void setUp() {
        mockSentence = new SpeechSentence(1L, "The quick brown fox", "EASY", "grammar");
    }

    @Test
    @DisplayName("getRandomSentence returns a random sentence from DB without difficulty")
    void getRandomSentence_withoutDifficulty() {
        when(sentenceRepo.findRandom()).thenReturn(Optional.of(mockSentence));

        SpeechSentenceDTO sentence = speechTestService.getRandomSentence(null);

        assertThat(sentence).isNotNull();
        assertThat(sentence.getText()).isEqualTo("The quick brown fox");
        verify(sentenceRepo).findRandom();
    }

    @Test
    @DisplayName("getRandomSentence returns a random sentence from DB with difficulty")
    void getRandomSentence_withDifficulty() {
        when(sentenceRepo.findRandomByDifficulty("EASY")).thenReturn(Optional.of(mockSentence));

        SpeechSentenceDTO sentence = speechTestService.getRandomSentence("EASY");

        assertThat(sentence).isNotNull();
        assertThat(sentence.getDifficulty()).isEqualTo("EASY");
        verify(sentenceRepo).findRandomByDifficulty("EASY");
    }

    @Test
    @DisplayName("evaluate returns high score when transcript matches perfectly")
    void evaluate_perfectMatch() {
        SpeechEvaluateRequest req = new SpeechEvaluateRequest();
        req.setSentenceId(1L);
        req.setTranscript("The quick brown fox");
        req.setUserEmail("test@example.com");

        when(sentenceRepo.findById(1L)).thenReturn(Optional.of(mockSentence));
        when(groqService.evaluatePronunciation(anyString(), anyString(), anyInt())).thenReturn("Perfect!");

        SpeechEvaluateResponse res = speechTestService.evaluate(req);

        assertThat(res.getScore()).isEqualTo(100);
        assertThat(res.getLabel()).isEqualTo("Excellent");
        assertThat(res.getFeedback()).isEqualTo("Perfect!");
        
        verify(resultRepo).save(any(SpeechTestResult.class));
    }

    @Test
    @DisplayName("evaluate returns poor score for bad match")
    void evaluate_poorMatch() {
        SpeechEvaluateRequest req = new SpeechEvaluateRequest();
        req.setSentenceId(1L);
        req.setTranscript("slow yellow dog");

        when(sentenceRepo.findById(1L)).thenReturn(Optional.of(mockSentence));
        when(groqService.evaluatePronunciation(anyString(), anyString(), anyInt())).thenReturn("Needs work.");

        SpeechEvaluateResponse res = speechTestService.evaluate(req);

        assertThat(res.getScore()).isLessThan(50);
        assertThat(res.getLabel()).isEqualTo("Poor");
        
        verify(resultRepo, never()).save(any(SpeechTestResult.class));
    }

    @Test
    @DisplayName("getHistory retrieves user test history")
    void getHistory() {
        SpeechTestResult mockResult = new SpeechTestResult();
        mockResult.setUserEmail("user@example.com");
        when(resultRepo.findByUserEmailOrderByCreatedAtDesc("user@example.com")).thenReturn(List.of(mockResult));

        List<SpeechTestResult> results = speechTestService.getHistory("user@example.com");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getUserEmail()).isEqualTo("user@example.com");
    }
}
