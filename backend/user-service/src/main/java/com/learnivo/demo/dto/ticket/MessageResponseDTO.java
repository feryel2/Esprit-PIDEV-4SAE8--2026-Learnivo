package com.learnivo.demo.dto.ticket;

import java.time.LocalDateTime;

public class MessageResponseDTO {
    private Long id;
    private String content;
    private Long senderId;
    private String senderEmail;
    private String senderRole;
    private LocalDateTime sentAt;

    public MessageResponseDTO() {}

    public MessageResponseDTO(Long id, String content, Long senderId, String senderEmail, String senderRole, LocalDateTime sentAt) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.senderEmail = senderEmail;
        this.senderRole = senderRole;
        this.sentAt = sentAt;
    }

    public static MessageResponseDTOBuilder builder() {
        return new MessageResponseDTOBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public static class MessageResponseDTOBuilder {
        private Long id;
        private String content;
        private Long senderId;
        private String senderEmail;
        private String senderRole;
        private LocalDateTime sentAt;

        public MessageResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public MessageResponseDTOBuilder content(String content) { this.content = content; return this; }
        public MessageResponseDTOBuilder senderId(Long senderId) { this.senderId = senderId; return this; }
        public MessageResponseDTOBuilder senderEmail(String senderEmail) { this.senderEmail = senderEmail; return this; }
        public MessageResponseDTOBuilder senderRole(String senderRole) { this.senderRole = senderRole; return this; }
        public MessageResponseDTOBuilder sentAt(LocalDateTime sentAt) { this.sentAt = sentAt; return this; }

        public MessageResponseDTO build() {
            return new MessageResponseDTO(id, content, senderId, senderEmail, senderRole, sentAt);
        }
    }
}
