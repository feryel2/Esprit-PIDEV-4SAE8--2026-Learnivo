package com.learnivo.demo.dto.ticket;

import com.learnivo.demo.enums.TicketPriority;
import com.learnivo.demo.enums.TicketStatus;
import java.time.LocalDateTime;

public class TicketResponseDTO {
    private Long id;
    private String subject;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private Long createdById;
    private String createdByEmail;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;

    public TicketResponseDTO() {}

    public TicketResponseDTO(Long id, String subject, String description, TicketStatus status, TicketPriority priority, Long createdById, String createdByEmail, Long categoryId, String categoryName, LocalDateTime createdAt, LocalDateTime closedAt) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdById = createdById;
        this.createdByEmail = createdByEmail;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.createdAt = createdAt;
        this.closedAt = closedAt;
    }

    public static TicketResponseDTOBuilder builder() {
        return new TicketResponseDTOBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }
    public String getCreatedByEmail() { return createdByEmail; }
    public void setCreatedByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public static class TicketResponseDTOBuilder {
        private Long id;
        private String subject;
        private String description;
        private TicketStatus status;
        private TicketPriority priority;
        private Long createdById;
        private String createdByEmail;
        private Long categoryId;
        private String categoryName;
        private LocalDateTime createdAt;
        private LocalDateTime closedAt;

        public TicketResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public TicketResponseDTOBuilder subject(String subject) { this.subject = subject; return this; }
        public TicketResponseDTOBuilder description(String description) { this.description = description; return this; }
        public TicketResponseDTOBuilder status(TicketStatus status) { this.status = status; return this; }
        public TicketResponseDTOBuilder priority(TicketPriority priority) { this.priority = priority; return this; }
        public TicketResponseDTOBuilder createdById(Long createdById) { this.createdById = createdById; return this; }
        public TicketResponseDTOBuilder createdByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; return this; }
        public TicketResponseDTOBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public TicketResponseDTOBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public TicketResponseDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TicketResponseDTOBuilder closedAt(LocalDateTime closedAt) { this.closedAt = closedAt; return this; }

        public TicketResponseDTO build() {
            return new TicketResponseDTO(id, subject, description, status, priority, createdById, createdByEmail, categoryId, categoryName, createdAt, closedAt);
        }
    }
}
