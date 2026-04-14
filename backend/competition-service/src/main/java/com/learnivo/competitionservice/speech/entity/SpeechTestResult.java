package com.learnivo.competitionservice.speech.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "speech_test_results")
@Data
@NoArgsConstructor
public class SpeechTestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sentenceId;

    @Column(nullable = false, length = 500)
    private String originalText;

    @Column(length = 500)
    private String transcript;

    @Column(nullable = false)
    private Integer score; // 0-100

    @Column(length = 20)
    private String label; // Poor, Fair, Good, Very Good, Excellent

    @Column(length = 100)
    private String userEmail;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
