package com.learnivo.competitionservice.speech.service;

import com.learnivo.competitionservice.speech.dto.SpeechEvaluateRequest;
import com.learnivo.competitionservice.speech.dto.SpeechEvaluateResponse;
import com.learnivo.competitionservice.speech.dto.SpeechSentenceDTO;
import com.learnivo.competitionservice.speech.entity.SpeechSentence;
import com.learnivo.competitionservice.speech.entity.SpeechTestResult;
import com.learnivo.competitionservice.speech.repository.SpeechSentenceRepository;
import com.learnivo.competitionservice.speech.repository.SpeechTestResultRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpeechTestService {

    private final GroqService groqService;

    private final SpeechSentenceRepository sentenceRepo;
    private final SpeechTestResultRepository resultRepo;

    // ── Seed sentences on startup ─────────────────────────────────────────────
    @PostConstruct
    public void seedSentences() {
        if (sentenceRepo.count() > 0) return;

        List<SpeechSentence> sentences = List.of(
            new SpeechSentence(null, "The quick brown fox jumps over the lazy dog.", "EASY", "pronunciation"),
            new SpeechSentence(null, "She sells sea shells by the sea shore.", "EASY", "pronunciation"),
            new SpeechSentence(null, "How much wood would a woodchuck chuck?", "EASY", "pronunciation"),
            new SpeechSentence(null, "I would like to improve my English speaking skills.", "EASY", "grammar"),
            new SpeechSentence(null, "Learning a new language opens many doors.", "EASY", "vocabulary"),
            new SpeechSentence(null, "The weather forecast predicts heavy rain this evening.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "Communication skills are essential in today's world.", "MEDIUM", "grammar"),
            new SpeechSentence(null, "Technology has transformed the way we interact with each other.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "The development of artificial intelligence raises ethical questions.", "HARD", "vocabulary"),
            new SpeechSentence(null, "Perseverance and dedication are the keys to achieving your goals.", "HARD", "pronunciation")
        );

        sentenceRepo.saveAll(sentences);
    }

    // ── Get random sentence ───────────────────────────────────────────────────
    public SpeechSentenceDTO getRandomSentence(String difficulty) {
        SpeechSentence sentence;
        if (difficulty != null && !difficulty.isBlank()) {
            sentence = sentenceRepo.findRandomByDifficulty(difficulty.toUpperCase())
                    .orElseGet(() -> sentenceRepo.findRandom().orElseThrow());
        } else {
            sentence = sentenceRepo.findRandom().orElseThrow();
        }
        return toDTO(sentence);
    }

    public List<SpeechSentenceDTO> getAllSentences() {
        return sentenceRepo.findAll().stream().map(this::toDTO).toList();
    }

    // ── Evaluate pronunciation ────────────────────────────────────────────────
    public SpeechEvaluateResponse evaluate(SpeechEvaluateRequest req) {
        SpeechSentence sentence = sentenceRepo.findById(req.getSentenceId())
                .orElseThrow(() -> new RuntimeException("Sentence not found: " + req.getSentenceId()));

        String original   = sentence.getText();
        String transcript = req.getTranscript() == null ? "" : req.getTranscript().trim();

        // 1. Calculate overall similarity score (0-100)
        int score = computeSimilarityScore(original, transcript);

        // 2. Word-by-word analysis
        List<SpeechEvaluateResponse.WordResult> wordResults = analyzeWords(original, transcript);

        // 3. Label + AI feedback via Groq
        String label    = scoreToLabel(score);
        String feedback = groqService.evaluatePronunciation(original, transcript, score);

        // 4. Persist result
        if (req.getUserEmail() != null && !req.getUserEmail().isBlank()) {
            SpeechTestResult result = new SpeechTestResult();
            result.setSentenceId(sentence.getId());
            result.setOriginalText(original);
            result.setTranscript(transcript);
            result.setScore(score);
            result.setLabel(label);
            result.setUserEmail(req.getUserEmail());
            resultRepo.save(result);
        }

        return SpeechEvaluateResponse.builder()
                .originalText(original)
                .transcript(transcript)
                .score(score)
                .label(label)
                .feedback(feedback)
                .wordResults(wordResults)
                .build();
    }

    // ── History ───────────────────────────────────────────────────────────────
    public List<SpeechTestResult> getHistory(String email) {
        return resultRepo.findByUserEmailOrderByCreatedAtDesc(email);
    }

    // ── Scoring algorithm (Levenshtein-based) ─────────────────────────────────
    private int computeSimilarityScore(String original, String transcript) {
        String a = normalize(original);
        String b = normalize(transcript);

        if (b.isEmpty()) return 0;

        int distance = levenshtein(a, b);
        int maxLen   = Math.max(a.length(), b.length());
        double similarity = 1.0 - (double) distance / maxLen;

        // Bonus: bonus word order check
        double wordBonus = wordOrderBonus(a, b);
        double finalScore = similarity * 0.8 + wordBonus * 0.2;

        return (int) Math.round(Math.max(0, Math.min(100, finalScore * 100)));
    }

    private double wordOrderBonus(String original, String transcript) {
        String[] origWords   = original.split("\\s+");
        String[] transWords  = transcript.split("\\s+");
        int matches = 0;
        for (String w : transWords) {
            for (String o : origWords) {
                if (o.equals(w)) { matches++; break; }
            }
        }
        int denominator = Math.max(origWords.length, 1);
        return (double) matches / denominator;
    }

    private List<SpeechEvaluateResponse.WordResult> analyzeWords(String original, String transcript) {
        String[] origWords  = normalize(original).split("\\s+");
        String[] transWords = normalize(transcript).split("\\s+");
        List<SpeechEvaluateResponse.WordResult> results = new ArrayList<>();

        for (int i = 0; i < origWords.length; i++) {
            String expected = origWords[i];
            String heard    = i < transWords.length ? transWords[i] : "";
            boolean correct = expected.equals(heard);
            results.add(new SpeechEvaluateResponse.WordResult(expected, heard, correct));
        }
        return results;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String normalize(String s) {
        return s.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String scoreToLabel(int score) {
        if (score >= 90) return "Excellent";
        if (score >= 75) return "Very Good";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Poor";
    }

    // ── Levenshtein distance ──────────────────────────────────────────────────
    private int levenshtein(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                                    Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }
        return dp[m][n];
    }

    private SpeechSentenceDTO toDTO(SpeechSentence s) {
        return new SpeechSentenceDTO(s.getId(), s.getText(), s.getDifficulty(), s.getCategory());
    }
}
