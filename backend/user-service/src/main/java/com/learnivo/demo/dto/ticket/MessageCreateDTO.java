package com.learnivo.demo.dto.ticket;

import jakarta.validation.constraints.NotBlank;

public class MessageCreateDTO {
    
    @NotBlank(message = "Content is required")
    private String content;

    public MessageCreateDTO() {}

    public MessageCreateDTO(String content) {
        this.content = content;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
