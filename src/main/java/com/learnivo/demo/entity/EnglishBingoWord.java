package com.learnivo.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "english_bingo_game_words")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EnglishBingoWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String word;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "english_bingo_game_word_classes",
            joinColumns = @JoinColumn(name = "word_id"),
            inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    private Set<EnglishBingoClass> correctClasses = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public Set<EnglishBingoClass> getCorrectClasses() {
        return correctClasses;
    }

    public void setCorrectClasses(Set<EnglishBingoClass> correctClasses) {
        this.correctClasses = correctClasses;
    }
}
