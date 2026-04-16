package com.learnivo.demo.entity;

import com.learnivo.demo.enums.TicketPriority;
import com.learnivo.demo.enums.TicketStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority = TicketPriority.MEDIUM;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private TicketCategory category;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    public SupportTicket() {}

    public SupportTicket(Long id, String subject, String description, TicketStatus status, TicketPriority priority, User createdBy, TicketCategory category, LocalDateTime createdAt, LocalDateTime closedAt) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.status = status != null ? status : TicketStatus.OPEN;
        this.priority = priority != null ? priority : TicketPriority.MEDIUM;
        this.createdBy = createdBy;
        this.category = category;
        this.createdAt = createdAt;
        this.closedAt = closedAt;
    }

    public static SupportTicketBuilder builder() {
        return new SupportTicketBuilder();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // Getters and Setters
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
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public TicketCategory getCategory() { return category; }
    public void setCategory(TicketCategory category) { this.category = category; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public static class SupportTicketBuilder {
        private Long id;
        private String subject;
        private String description;
        private TicketStatus status = TicketStatus.OPEN;
        private TicketPriority priority = TicketPriority.MEDIUM;
        private User createdBy;
        private TicketCategory category;
        private LocalDateTime createdAt;
        private LocalDateTime closedAt;

        public SupportTicketBuilder id(Long id) { this.id = id; return this; }
        public SupportTicketBuilder subject(String subject) { this.subject = subject; return this; }
        public SupportTicketBuilder description(String description) { this.description = description; return this; }
        public SupportTicketBuilder status(TicketStatus status) { this.status = status; return this; }
        public SupportTicketBuilder priority(TicketPriority priority) { this.priority = priority; return this; }
        public SupportTicketBuilder createdBy(User createdBy) { this.createdBy = createdBy; return this; }
        public SupportTicketBuilder category(TicketCategory category) { this.category = category; return this; }
        public SupportTicketBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public SupportTicketBuilder closedAt(LocalDateTime closedAt) { this.closedAt = closedAt; return this; }

        public SupportTicket build() {
            return new SupportTicket(id, subject, description, status, priority, createdBy, category, createdAt, closedAt);
        }
    }
}
