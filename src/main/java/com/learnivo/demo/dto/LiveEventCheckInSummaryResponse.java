package com.learnivo.demo.dto;

public record LiveEventCheckInSummaryResponse(
        Long id,
        String message,
        String createdAt,
        long respondedCount,
        long expectedCount
) {
}
