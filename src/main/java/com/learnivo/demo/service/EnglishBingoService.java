package com.learnivo.demo.service;

import com.learnivo.demo.dto.*;
import com.learnivo.demo.entity.EnglishBingoClass;
import com.learnivo.demo.entity.EnglishBingoWord;
import com.learnivo.demo.repository.EnglishBingoClassRepository;
import com.learnivo.demo.repository.EnglishBingoWordRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnglishBingoService {

    private static final int MAX_GRID = 9;
    /** Plateau fixe 3×3 (9 cases), classes tirées au hasard. */
    private static final int GAME_GRID_MAX = 9;
    private static final int GAME_WORD_COUNT = 20;

    private final EnglishBingoClassRepository classRepository;
    private final EnglishBingoWordRepository wordRepository;

    @Value("${learnivo.asset-base-url:http://localhost:8085}")
    private String assetBaseUrl;

    private Path bingoUploadDir;

    public EnglishBingoService(
            EnglishBingoClassRepository classRepository,
            EnglishBingoWordRepository wordRepository) {
        this.classRepository = classRepository;
        this.wordRepository = wordRepository;
    }

    @PostConstruct
    public void initUploadDir() throws IOException {
        bingoUploadDir = Paths.get("./uploads/english-bingo");
        Files.createDirectories(bingoUploadDir);
    }

    private String publicUrl(String relativePath) {
        String base = assetBaseUrl.endsWith("/") ? assetBaseUrl.substring(0, assetBaseUrl.length() - 1) : assetBaseUrl;
        return base + relativePath;
    }

    private EnglishBingoClassResponse toClassResponse(EnglishBingoClass c) {
        return new EnglishBingoClassResponse(c.getId(), c.getLabel(), publicUrl(c.getImagePath()));
    }

    @Transactional(readOnly = true)
    public EnglishBingoAdminOverviewResponse getAdminOverview() {
        List<EnglishBingoClassResponse> classes = classRepository.findAllByOrderByIdAsc().stream()
                .map(this::toClassResponse)
                .collect(Collectors.toList());
        List<EnglishBingoWordAdminResponse> words = wordRepository.findAllWithClasses().stream()
                .map(w -> new EnglishBingoWordAdminResponse(
                        w.getId(),
                        w.getWord(),
                        w.getCorrectClasses().stream().map(EnglishBingoClass::getId).sorted().toList()
                ))
                .collect(Collectors.toList());
        return new EnglishBingoAdminOverviewResponse(classes, words);
    }

    @Transactional
    public EnglishBingoClassResponse createClass(String label, MultipartFile file) throws IOException {
        if (label == null || label.isBlank()) {
            throw new IllegalArgumentException("Le nom de la classe est obligatoire (ex. Vegetables).");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Une image est obligatoire.");
        }
        String ext = extensionOf(file.getOriginalFilename());
        String filename = UUID.randomUUID() + ext;
        Path dest = bingoUploadDir.resolve(filename);
        Files.copy(file.getInputStream(), dest);
        String relative = "/uploads/english-bingo/" + filename;

        EnglishBingoClass c = new EnglishBingoClass();
        c.setLabel(label.trim());
        c.setImagePath(relative);
        EnglishBingoClass saved = classRepository.save(c);
        return toClassResponse(saved);
    }

    @Transactional
    public void deleteClass(Long classId) {
        EnglishBingoClass c = classRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Classe introuvable."));
        List<EnglishBingoWord> all = wordRepository.findAllWithClasses();
        List<EnglishBingoWord> orphanWords = new ArrayList<>();
        for (EnglishBingoWord w : all) {
            w.getCorrectClasses().removeIf(x -> x.getId().equals(classId));
            if (w.getCorrectClasses().isEmpty()) {
                orphanWords.add(w);
            }
        }
        wordRepository.deleteAll(orphanWords);
        classRepository.delete(c);
    }

    private String extensionOf(String original) {
        if (original == null || !original.contains(".")) {
            return ".bin";
        }
        return original.substring(original.lastIndexOf('.')).toLowerCase(Locale.ROOT);
    }

    @Transactional
    public EnglishBingoWordAdminResponse addWord(EnglishBingoWordCreateRequest req) {
        if (req.word() == null || req.word().isBlank()) {
            throw new IllegalArgumentException("Le mot est obligatoire.");
        }
        if (req.correctClassIds() == null || req.correctClassIds().isEmpty()) {
            throw new IllegalArgumentException("Cochez au moins une classe parente.");
        }
        if (req.correctClassIds().size() > MAX_GRID) {
            throw new IllegalArgumentException("Un mot ne peut être lié qu'à " + MAX_GRID + " classes maximum (taille max. de la grille).");
        }
        List<EnglishBingoClass> all = classRepository.findAllByOrderByIdAsc();
        Map<Long, EnglishBingoClass> byId = all.stream().collect(Collectors.toMap(EnglishBingoClass::getId, x -> x));
        Set<EnglishBingoClass> chosen = new HashSet<>();
        for (Long cid : req.correctClassIds()) {
            EnglishBingoClass cl = byId.get(cid);
            if (cl == null) {
                throw new IllegalArgumentException("Classe inconnue : " + cid);
            }
            chosen.add(cl);
        }
        EnglishBingoWord w = new EnglishBingoWord();
        w.setWord(req.word().trim());
        w.setCorrectClasses(chosen);
        EnglishBingoWord saved = wordRepository.save(w);
        return new EnglishBingoWordAdminResponse(
                saved.getId(),
                saved.getWord(),
                saved.getCorrectClasses().stream().map(EnglishBingoClass::getId).sorted().toList()
        );
    }

    @Transactional(readOnly = true)
    public EnglishBingoGameSessionResponse buildGameSession() {
        List<EnglishBingoClass> pool = new ArrayList<>(classRepository.findAllByOrderByIdAsc());
        List<EnglishBingoWord> allWords = new ArrayList<>(wordRepository.findAllWithClasses());
        if (pool.isEmpty()) {
            throw new IllegalArgumentException("Ajoutez au moins une classe avec image avant de jouer.");
        }
        if (allWords.isEmpty()) {
            throw new IllegalArgumentException("Ajoutez au moins un mot avant de jouer.");
        }
        Collections.shuffle(pool);
        int gridN = Math.min(GAME_GRID_MAX, pool.size());
        List<EnglishBingoClass> grid = new ArrayList<>(pool.subList(0, gridN));
        Collections.shuffle(allWords);
        int wordN = Math.min(GAME_WORD_COUNT, allWords.size());
        List<EnglishBingoWord> picked = new ArrayList<>(allWords.subList(0, wordN));
        List<EnglishBingoClassResponse> gridDto = grid.stream().map(this::toClassResponse).collect(Collectors.toList());
        List<EnglishBingoWordItemResponse> wordsDto = picked.stream()
                .map(w -> new EnglishBingoWordItemResponse(w.getId(), w.getWord()))
                .collect(Collectors.toList());
        return new EnglishBingoGameSessionResponse(gridDto, wordsDto);
    }

    @Transactional(readOnly = true)
    public EnglishBingoPlayRoundResponse randomPlayRound() {
        List<EnglishBingoClass> pool = classRepository.findAllByOrderByIdAsc();
        List<EnglishBingoWord> words = wordRepository.findAllWithClasses();
        if (pool.isEmpty()) {
            throw new IllegalArgumentException("Ajoutez au moins une classe avec image avant de jouer.");
        }
        if (words.isEmpty()) {
            throw new IllegalArgumentException("Ajoutez au moins un mot avant de jouer.");
        }

        List<EnglishBingoWord> shuffled = new ArrayList<>(words);
        Collections.shuffle(shuffled);

        for (EnglishBingoWord w : shuffled) {
            Set<EnglishBingoClass> need = w.getCorrectClasses();
            int targetGridSize = Math.min(MAX_GRID, pool.size());
            if (need.size() > MAX_GRID || need.size() > targetGridSize) {
                continue;
            }
            LinkedHashSet<EnglishBingoClass> grid = new LinkedHashSet<>(need);
            List<EnglishBingoClass> rest = pool.stream().filter(c -> !need.contains(c)).collect(Collectors.toList());
            Collections.shuffle(rest);
            for (EnglishBingoClass c : rest) {
                if (grid.size() >= targetGridSize) {
                    break;
                }
                grid.add(c);
            }

            List<EnglishBingoClass> gridList = new ArrayList<>(grid);
            Collections.shuffle(gridList);
            List<EnglishBingoClassResponse> gridDto = gridList.stream().map(this::toClassResponse).collect(Collectors.toList());
            return new EnglishBingoPlayRoundResponse(gridDto, w.getId(), w.getWord());
        }

        throw new IllegalArgumentException(
                "Aucun mot ne peut être joué : vérifiez que chaque mot n'est lié qu'à des classes existantes (max. " + MAX_GRID + " par mot).");
    }

    @Transactional(readOnly = true)
    public EnglishBingoCheckResponse checkAnswer(EnglishBingoCheckRequest req) {
        EnglishBingoWord w = wordRepository.findByIdWithClasses(req.wordId())
                .orElseThrow(() -> new IllegalArgumentException("Mot introuvable."));
        
        Set<Long> expected = w.getCorrectClasses().stream()
                .map(EnglishBingoClass::getId)
                .collect(Collectors.toSet());
        
        Set<Long> selected = new HashSet<>(req.selectedClassIds());
        
        if (selected.isEmpty()) {
            return new EnglishBingoCheckResponse(false, expected.size(), 0, 0, "Aucune sélection.");
        }

        int correctSelected = (int) selected.stream().filter(expected::contains).count();
        
        // On considère un match "parfait" si tout ce qui est sélectionné est correct 
        // (permet la validation incrémentale d'un mot à plusieurs classes).
        boolean allSelectedAreCorrect = (correctSelected == selected.size());
        boolean hasFoundEverything = (correctSelected == expected.size());
        
        boolean perfectOutcome = allSelectedAreCorrect; // Retourne true si les clics sont bons
        
        String msg;
        if (hasFoundEverything && allSelectedAreCorrect) {
            msg = "Bravo ! Vous avez trouvé toutes les classes pour ce mot.";
        } else if (allSelectedAreCorrect) {
            msg = "Bien ! Cette sélection est correcte (il peut rester d'autres classes).";
        } else if (correctSelected > 0) {
            msg = "Certaines classes sont correctes, mais d'autres ne correspondent pas.";
        } else {
            msg = "Cette sélection ne convient pas à ce mot.";
        }

        return new EnglishBingoCheckResponse(
                perfectOutcome,
                expected.size(),
                selected.size(),
                correctSelected,
                msg
        );
    }

    @Transactional
    public void deleteWord(Long wordId) {
        EnglishBingoWord w = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("Mot introuvable."));
        wordRepository.delete(w);
    }
}
