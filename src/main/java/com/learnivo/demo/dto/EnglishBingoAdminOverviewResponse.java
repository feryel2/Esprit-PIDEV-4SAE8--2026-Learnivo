package com.learnivo.demo.dto;

import java.util.List;

public record EnglishBingoAdminOverviewResponse(
        List<EnglishBingoClassResponse> classes,
        List<EnglishBingoWordAdminResponse> words
) {
}
