package com.learnivo.demo.dto;

import jakarta.validation.constraints.NotNull;

public record LiveEventCheckInStudentAckRequest(@NotNull Long studentId) {
}
