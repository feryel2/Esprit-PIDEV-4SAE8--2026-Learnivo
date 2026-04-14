package com.learnivo.competitionservice.speech.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "speech_sentences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpeechSentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String text;

    @Column(length = 50)
    private String difficulty; // EASY, MEDIUM, HARD

    @Column(length = 100)
    private String category; // grammar, vocabulary, pronunciation
}
