package com.learnivo.demo.dto;

import java.util.List;

/** Session : plateau 3×3 (9 classes max, tirées au hasard) + jusqu'à 20 mots (ordre aléatoire côté serveur). */
public record EnglishBingoGameSessionResponse(
        List<EnglishBingoClassResponse> gridClasses,
        List<EnglishBingoWordItemResponse> words
) {
}
