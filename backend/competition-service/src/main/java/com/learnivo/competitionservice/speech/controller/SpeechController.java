package com.learnivo.competitionservice.speech.controller;

import com.learnivo.competitionservice.speech.dto.SpeechEvaluateRequest;
import com.learnivo.competitionservice.speech.dto.SpeechEvaluateResponse;
import com.learnivo.competitionservice.speech.dto.SpeechSentenceDTO;
import com.learnivo.competitionservice.speech.entity.SpeechTestResult;
import com.learnivo.competitionservice.speech.service.SpeechTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/speech")
@RequiredArgsConstructor
public class SpeechController {

    private final SpeechTestService speechTestService;

    /** GET /api/speech/sentence?difficulty=EASY */
    @GetMapping("/sentence")
    public ResponseEntity<SpeechSentenceDTO> getRandomSentence(
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(speechTestService.getRandomSentence(difficulty));
    }

    /** GET /api/speech/sentences */
    @GetMapping("/sentences")
    public ResponseEntity<List<SpeechSentenceDTO>> getAllSentences() {
        return ResponseEntity.ok(speechTestService.getAllSentences());
    }

    /** POST /api/speech/evaluate */
    @PostMapping("/evaluate")
    public ResponseEntity<SpeechEvaluateResponse> evaluate(
            @RequestBody SpeechEvaluateRequest request) {
        return ResponseEntity.ok(speechTestService.evaluate(request));
    }

    /** GET /api/speech/history/{email} */
    @GetMapping("/history/{email}")
    public ResponseEntity<List<SpeechTestResult>> getHistory(@PathVariable String email) {
        return ResponseEntity.ok(speechTestService.getHistory(email));
    }
}
