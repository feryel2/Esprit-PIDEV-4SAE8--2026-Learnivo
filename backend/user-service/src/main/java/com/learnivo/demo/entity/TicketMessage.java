package com.learnivo.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_messages")
public class TicketMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private SupportTicket ticket;
    
    @Column(name = "sent_at", nullable = false, updatable = false)
    private LocalDateTime sentAt;

    public TicketMessage() {}

    public TicketMessage(Long id, String content, User sender, SupportTicket ticket, LocalDateTime sentAt) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.ticket = ticket;
        this.sentAt = sentAt;
    }

    public static TicketMessageBuilder builder() {
        return new TicketMessageBuilder();
    }

    @PrePersist
    protected void onCreate() {
        if (sentAt == null) sentAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public SupportTicket getTicket() { return ticket; }
    public void setTicket(SupportTicket ticket) { this.ticket = ticket; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public static class TicketMessageBuilder {
        private Long id;
        private String content;
        private User sender;
        private SupportTicket ticket;
        private LocalDateTime sentAt;

        public TicketMessageBuilder id(Long id) { this.id = id; return this; }
        public TicketMessageBuilder content(String content) { this.content = content; return this; }
        public TicketMessageBuilder sender(User sender) { this.sender = sender; return this; }
        public TicketMessageBuilder ticket(SupportTicket ticket) { this.ticket = ticket; return this; }
        public TicketMessageBuilder sentAt(LocalDateTime sentAt) { this.sentAt = sentAt; return this; }

        public TicketMessage build() {
            return new TicketMessage(id, content, sender, ticket, sentAt);
        }
    }
}
