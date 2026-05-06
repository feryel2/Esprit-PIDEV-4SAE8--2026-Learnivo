package com.learnivo.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record EnglishBingoWordCreateRequest(
        @NotBlank String word,
        @NotNull List<Long> correctClassIds
) {
}
