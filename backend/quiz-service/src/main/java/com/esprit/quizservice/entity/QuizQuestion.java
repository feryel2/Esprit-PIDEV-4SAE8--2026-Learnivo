package com.esprit.quizservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String questionKey;

    @Column(nullable = false, length = 220)
    private String text;

    @Column(nullable = false, length = 160)
    private String optionOne;

    @Column(nullable = false, length = 160)
    private String optionTwo;

    @Column(nullable = false, length = 160)
    private String optionThree;

    @Column(nullable = false, length = 160)
    private String optionFour;

    @Column(nullable = false)
    private Integer correctAnswer;

    @Column(nullable = false, length = 260)
    private String explanation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
}
