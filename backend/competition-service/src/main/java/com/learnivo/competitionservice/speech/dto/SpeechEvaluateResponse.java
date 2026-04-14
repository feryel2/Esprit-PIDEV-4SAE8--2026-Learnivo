package com.learnivo.competitionservice.speech.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpeechEvaluateResponse {

    private String originalText;
    private String transcript;
    private int score;           // 0 - 100
    private String label;        // Poor | Fair | Good | Very Good | Excellent
    private String feedback;     // message de feedback
    private List<WordResult> wordResults; // mot par mot

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WordResult {
        private String expected;
        private String heard;
        private boolean correct;
    }
}
