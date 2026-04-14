package com.learnivo.competitionservice.speech.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpeechSentenceDTO {
    private Long id;
    private String text;
    private String difficulty;
    private String category;
}
