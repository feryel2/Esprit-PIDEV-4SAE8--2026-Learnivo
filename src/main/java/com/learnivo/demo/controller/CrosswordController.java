package com.learnivo.demo.controller;

import com.learnivo.demo.entity.CrosswordClue;
import com.learnivo.demo.entity.CrosswordPuzzle;
import com.learnivo.demo.repository.CrosswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/crossword")
@CrossOrigin(origins = "*")
public class CrosswordController {

    @Autowired
    private CrosswordRepository crosswordRepository;

    @GetMapping("/latest")
    public CrosswordPuzzle getLatestPuzzle() {
        try {
            List<CrosswordPuzzle> puzzles = crosswordRepository.findAll();
            if (puzzles.isEmpty()) {
                return seedDefaultPuzzle();
            }
            return puzzles.get(puzzles.size() - 1);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping
    public List<CrosswordPuzzle> getAllPuzzles() {
        return crosswordRepository.findAll();
    }

    @PostMapping
    public CrosswordPuzzle savePuzzle(@RequestBody CrosswordPuzzle puzzle) {
        try {
            // If ID is 0 or null, ensure Hibernate treats it as new
            if (puzzle.getId() != null && puzzle.getId() == 0) {
                puzzle.setId(null);
            }
            
            // Link clues back to puzzle
            if (puzzle.getClues() != null) {
                for (CrosswordClue clue : puzzle.getClues()) {
                    clue.setPuzzle(puzzle);
                    if (clue.getId() != null && clue.getId() == 0) {
                        clue.setId(null);
                    }
                }
            }
            return crosswordRepository.save(puzzle);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public void deletePuzzle(@PathVariable Long id) {
        crosswordRepository.deleteById(id);
    }

    private CrosswordPuzzle seedDefaultPuzzle() {
        CrosswordPuzzle puzzle = new CrosswordPuzzle();
        puzzle.setTitle("English Vocabulary Mastery");
        puzzle.setGridSize(10);
        
        List<CrosswordClue> clues = new ArrayList<>();
        
        clues.add(createClue(1, "across", "Greeting (5 letters)", "HELLO", 0, 0, puzzle));
        clues.add(createClue(4, "across", "You read this (4 letters)", "BOOK", 6, 0, puzzle));
        clues.add(createClue(7, "across", "Red fruit (5 letters)", "APPLE", 0, 3, puzzle));
        clues.add(createClue(9, "across", "Human best friend (3 letters)", "DOG", 6, 4, puzzle));
        clues.add(createClue(10, "across", "Place for learning (6 letters)", "SCHOOL", 0, 6, puzzle));
        clues.add(createClue(12, "across", "Citrus fruit and color (6 letters)", "ORANGE", 0, 9, puzzle));
        
        clues.add(createClue(1, "down", "Opposite of sad (5 letters)", "HAPPY", 0, 0, puzzle));
        clues.add(createClue(2, "down", "To acquire knowledge (5 letters)", "LEARN", 2, 0, puzzle));
        clues.add(createClue(3, "down", "Opposite of closed (4 letters)", "OPEN", 4, 0, puzzle));
        clues.add(createClue(5, "down", "Not new (3 letters)", "OLD", 7, 0, puzzle));
        clues.add(createClue(6, "down", "Male ruler (4 letters)", "KING", 9, 0, puzzle));
        clues.add(createClue(8, "down", "King of the jungle (4 letters)", "LION", 3, 3, puzzle));
        clues.add(createClue(11, "down", "Strong affection (4 letters)", "LOVE", 6, 6, puzzle));
        
        puzzle.setClues(clues);
        return crosswordRepository.save(puzzle);
    }

    private CrosswordClue createClue(int number, String dir, String clueText, String answer, int x, int y, CrosswordPuzzle puzzle) {
        CrosswordClue c = new CrosswordClue();
        c.setNumber(number);
        c.setDirection(dir);
        c.setClue(clueText);
        c.setAnswer(answer);
        c.setX(x);
        c.setY(y);
        c.setPuzzle(puzzle);
        return c;
    }
}
