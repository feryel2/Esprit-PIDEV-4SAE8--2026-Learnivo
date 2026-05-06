package com.learnivo.demo.dto;

import java.util.List;

/**
 * Une manche : grille tirée au hasard (jusqu'à 9 classes) + un mot tiré au hasard parmi ceux jouables sur cette grille.
 */
public record EnglishBingoPlayRoundResponse(
        List<EnglishBingoClassResponse> gridClasses,
        Long wordId,
        String word
) {
}
