package com.learnivo.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EventRegistrationRequest(
        @JsonProperty("registeredAt")
        @NotNull(message = "Registered at is required")
        LocalDateTime registeredAt,
        @JsonProperty("status")
        @NotNull(message = "Status is required")
        String status,
        @JsonProperty("eventId")
        @NotNull(message = "Event is required")
        Long eventId,
        @JsonProperty("studentId")
        @NotNull(message = "Student is required")
        Long studentId,
        /**
         * Si true : inscription créée depuis l’admin — on n’applique pas les règles self-service
         * (accès club, capacité, événement déjà commencé). Doublon : on renvoie l’inscription existante.
         */
        @JsonProperty("adminOverride")
        Boolean adminOverride
) {}
