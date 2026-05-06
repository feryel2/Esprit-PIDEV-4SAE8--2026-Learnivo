package com.learnivo.demo.dto;

import java.util.List;

public record EnglishBingoWordAdminResponse(
        Long id,
        String word,
        List<Long> correctClassIds
) {
}
