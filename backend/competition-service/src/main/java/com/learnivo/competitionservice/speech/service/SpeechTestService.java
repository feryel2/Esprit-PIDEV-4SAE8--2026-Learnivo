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
        if (sentenceRepo.count() < 40) {
            sentenceRepo.deleteAll();
        } else {
            return;
        }

        List<SpeechSentence> sentences = List.of(
            // EASY (15 sentences)
            new SpeechSentence(null, "The quick brown fox jumps over the lazy dog.", "EASY", "pronunciation"),
            new SpeechSentence(null, "She sells sea shells by the sea shore.", "EASY", "pronunciation"),
            new SpeechSentence(null, "How much wood would a woodchuck chuck?", "EASY", "pronunciation"),
            new SpeechSentence(null, "I would like to improve my English speaking skills.", "EASY", "grammar"),
            new SpeechSentence(null, "Learning a new language opens many doors.", "EASY", "vocabulary"),
            new SpeechSentence(null, "Hello, how are you doing today?", "EASY", "vocabulary"),
            new SpeechSentence(null, "My favorite color is blue because it reminds me of the ocean.", "EASY", "vocabulary"),
            new SpeechSentence(null, "I usually drink coffee in the morning to wake up.", "EASY", "grammar"),
            new SpeechSentence(null, "He likes to play football with his friends on the weekend.", "EASY", "grammar"),
            new SpeechSentence(null, "We went to the park and ate some ice cream.", "EASY", "pronunciation"),
            new SpeechSentence(null, "Can you please pass me the salt and pepper?", "EASY", "vocabulary"),
            new SpeechSentence(null, "Their house is located near the beautiful mountains.", "EASY", "pronunciation"),
            new SpeechSentence(null, "I need to buy some groceries from the supermarket.", "EASY", "vocabulary"),
            new SpeechSentence(null, "It is very important to get enough sleep every night.", "EASY", "pronunciation"),
            new SpeechSentence(null, "My dog loves to chase after tennis balls in the garden.", "EASY", "grammar"),

            // MEDIUM (15 sentences)
            new SpeechSentence(null, "The weather forecast predicts heavy rain this evening.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "Communication skills are essential in today's world.", "MEDIUM", "grammar"),
            new SpeechSentence(null, "Technology has transformed the way we interact with each other.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "Although it was raining heavily, we decided to continue our journey.", "MEDIUM", "grammar"),
            new SpeechSentence(null, "Many different species of birds migrate to the south during the winter.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "I have been working on this difficult project for three consecutive weeks.", "MEDIUM", "grammar"),
            new SpeechSentence(null, "Environmental protection is a critical issue that requires global cooperation.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "If I had known you were coming, I would have prepared a delicious dinner.", "MEDIUM", "grammar"),
            new SpeechSentence(null, "The remarkable architecture of the ancient ruin fascinated the archaeologists.", "MEDIUM", "pronunciation"),
            new SpeechSentence(null, "Effective leadership involves listening to your team and providing constructive feedback.", "MEDIUM", "pronunciation"),
            new SpeechSentence(null, "The symphony orchestra performed a magnificent rendition of Beethoven's ninth.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "In spite of the numerous challenges, the ambitious startup succeeded surprisingly well.", "MEDIUM", "grammar"),
            new SpeechSentence(null, "She confidently delivered an inspiring presentation to the board of directors.", "MEDIUM", "pronunciation"),
            new SpeechSentence(null, "Financial literacy plays a crucial role in maintaining personal economic stability.", "MEDIUM", "vocabulary"),
            new SpeechSentence(null, "Reading extensive amounts of literature significantly improves your cognitive abilities.", "MEDIUM", "grammar"),

            // HARD (15 sentences)
            new SpeechSentence(null, "The development of artificial intelligence raises complex ethical questions.", "HARD", "vocabulary"),
            new SpeechSentence(null, "Perseverance and dedication are undeniably the fundamental keys to achieving your ultimate goals.", "HARD", "pronunciation"),
            new SpeechSentence(null, "To adequately comprehend quantum mechanics requires an exceptional grasp of advanced mathematical paradigms.", "HARD", "vocabulary"),
            new SpeechSentence(null, "The paradoxical nature of the protagonist’s actions left the bewildered audience utterly spellbound.", "HARD", "pronunciation"),
            new SpeechSentence(null, "Having meticulously scrutinized the empirical evidence, the relentless researchers hypothesized an unprecedented phenomenon.", "HARD", "grammar"),
            new SpeechSentence(null, "She sells seashells by the seashore; the shells she sells are surely seashells.", "HARD", "pronunciation"),
            new SpeechSentence(null, "An instantaneous, simultaneous occurrence miraculously synchronized the seemingly anomalous astronomical events.", "HARD", "vocabulary"),
            new SpeechSentence(null, "Unequivocally, the bureaucratic administration continuously exacerbates the infrastructural vulnerabilities of the metropolis.", "HARD", "pronunciation"),
            new SpeechSentence(null, "Philosophically speaking, existentialism heavily emphasizes individual existence, freedom, and arbitrary choice.", "HARD", "vocabulary"),
            new SpeechSentence(null, "Had the distinguished committee thoroughly evaluated the multifaceted proposal, the catastrophic repercussions might have been entirely circumvented.", "HARD", "grammar"),
            new SpeechSentence(null, "The sixth sick sheik's sixth sheep's sick.", "HARD", "pronunciation"),
            new SpeechSentence(null, "A multifaceted geopolitical strategy is indispensable for mitigating the ramifications of international economic volatility.", "HARD", "vocabulary"),
            new SpeechSentence(null, "I thought a thought, but the thought I thought wasn't the thought I thought I thought.", "HARD", "pronunciation"),
            new SpeechSentence(null, "Incontrovertible proof of extraterrestrial microorganisms could profoundly orchestrate a paradigm shift in contemporary astrobiology.", "HARD", "vocabulary"),
            new SpeechSentence(null, "Notwithstanding his idiosyncratic temperamental fluctuations, the eccentric virtuoso unequivocally revolutionized classical symphony composition.", "HARD", "grammar")
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

        if (origWords.length == 0 || (origWords.length == 1 && origWords[0].isEmpty())) {
            return results;
        }
        if (transWords.length == 0 || (transWords.length == 1 && transWords[0].isEmpty())) {
            for (String w : origWords) {
                results.add(new SpeechEvaluateResponse.WordResult(w, "", false));
            }
            return results;
        }

        int m = origWords.length;
        int n = transWords.length;
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (origWords[i - 1].equals(transWords[j - 1])) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], 
                                   Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }

        int i = m, j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && origWords[i - 1].equals(transWords[j - 1])) {
                results.add(0, new SpeechEvaluateResponse.WordResult(origWords[i - 1], transWords[j - 1], true));
                i--;
                j--;
            } else {
                int sub = (i > 0 && j > 0) ? dp[i - 1][j - 1] : Integer.MAX_VALUE;
                int del = (i > 0) ? dp[i - 1][j] : Integer.MAX_VALUE;
                int ins = (j > 0) ? dp[i][j - 1] : Integer.MAX_VALUE;

                int min = Math.min(sub, Math.min(del, ins));

                if (min == sub && dp[i][j] == sub + 1) {
                    results.add(0, new SpeechEvaluateResponse.WordResult(origWords[i - 1], transWords[j - 1], false));
                    i--;
                    j--;
                } else if (min == del && dp[i][j] == del + 1) {
                    results.add(0, new SpeechEvaluateResponse.WordResult(origWords[i - 1], "", false));
                    i--;
                } else if (min == ins && dp[i][j] == ins + 1) {
                    j--;
                } else {
                    if (i > 0) i--;
                    else j--;
                }
            }
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
