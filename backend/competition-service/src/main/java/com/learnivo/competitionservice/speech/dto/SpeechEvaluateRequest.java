package com.learnivo.competitionservice.speech.dto;

import lombok.Data;

@Data
public class SpeechEvaluateRequest {
    private Long sentenceId;
    private String transcript;
    private String userEmail; // optional
}
