package com.learnivo.demo.dto;

public record EnglishBingoCheckResponse(
        boolean perfectMatch,
        int expectedCount,
        int selectedCount,
        int correctSelectedCount,
        String message
) {
}
