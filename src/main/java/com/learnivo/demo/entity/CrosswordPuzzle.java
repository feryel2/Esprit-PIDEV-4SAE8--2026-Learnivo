package com.learnivo.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "crossword_puzzles")
public class CrosswordPuzzle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private int gridSize;

    @OneToMany(mappedBy = "puzzle", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CrosswordClue> clues;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getGridSize() {
        return gridSize;
    }

    public void setGridSize(int gridSize) {
        this.gridSize = gridSize;
    }

    public List<CrosswordClue> getClues() {
        return clues;
    }

    public void setClues(List<CrosswordClue> clues) {
        this.clues = clues;
    }
}
