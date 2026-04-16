package com.learnivo.demo.dto.ticket;

import com.learnivo.demo.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;

public class TicketCreateDTO {
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private TicketPriority priority;
    
    private Long categoryId;

    public TicketCreateDTO() {}

    public TicketCreateDTO(String subject, String description, TicketPriority priority, Long categoryId) {
        this.subject = subject;
        this.description = description;
        this.priority = priority;
        this.categoryId = categoryId;
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
