package com.learnivo.demo.dto;

public record LiveEventCheckInPendingResponse(
        Long id,
        Long eventId,
        String eventTitle,
        String message,
        String createdAt
) {
}
