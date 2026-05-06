package com.learnivo.demo.dto;

public record LiveEventCheckInParticipantStatusResponse(
        Long studentId,
        String studentName,
        boolean present,
        String respondedAt
) {
}
