package com.learnivo.demo.controller;

import com.learnivo.demo.dto.*;
import com.learnivo.demo.service.EnglishBingoService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/english-bingo")
@CrossOrigin(origins = "*")
public class EnglishBingoController {

    private final EnglishBingoService englishBingoService;

    public EnglishBingoController(EnglishBingoService englishBingoService) {
        this.englishBingoService = englishBingoService;
    }

    /** Admin : toutes les classes et tous les mots. */
    @GetMapping("/admin")
    public ResponseEntity<EnglishBingoAdminOverviewResponse> adminOverview() {
        return ResponseEntity.ok(englishBingoService.getAdminOverview());
    }

    @PostMapping(value = "/classes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EnglishBingoClassResponse> createClass(
            @RequestParam String label,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(englishBingoService.createClass(label, file));
    }

    @DeleteMapping("/classes/{classId}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long classId) {
        englishBingoService.deleteClass(classId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/words")
    public ResponseEntity<EnglishBingoWordAdminResponse> addWord(@Valid @RequestBody EnglishBingoWordCreateRequest req) {
        return ResponseEntity.ok(englishBingoService.addWord(req));
    }

    @DeleteMapping("/words/{wordId}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long wordId) {
        englishBingoService.deleteWord(wordId);
        return ResponseEntity.noContent().build();
    }

    /** Jeu : session (grille jusqu'à 16 cases + jusqu'à 20 mots au hasard). */
    @GetMapping("/play/game-session")
    public ResponseEntity<EnglishBingoGameSessionResponse> gameSession() {
        return ResponseEntity.ok(englishBingoService.buildGameSession());
    }

    /** Jeu : grille + mot tirés au hasard (ancienne manche rapide). */
    @GetMapping("/play/random-round")
    public ResponseEntity<EnglishBingoPlayRoundResponse> randomRound() {
        return ResponseEntity.ok(englishBingoService.randomPlayRound());
    }

    @PostMapping("/play/check")
    public ResponseEntity<EnglishBingoCheckResponse> check(@Valid @RequestBody EnglishBingoCheckRequest req) {
        return ResponseEntity.ok(englishBingoService.checkAnswer(req));
    }
}
