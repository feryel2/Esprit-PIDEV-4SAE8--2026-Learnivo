package com.learnivo.demo.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record EnglishBingoCheckRequest(
        @NotNull Long wordId,
        @NotNull List<Long> selectedClassIds
) {
}
