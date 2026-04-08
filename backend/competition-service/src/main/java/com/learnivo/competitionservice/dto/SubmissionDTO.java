package com.learnivo.competitionservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SubmissionDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Submission URL is required")
    @Pattern(regexp = "^(http|https)://.*", message = "Submission URL must be a valid link")
    private String submissionUrl;

    private String submissionNotes;
}
