package com.learnivo.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    private String location;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Event() {}

    public Event(Long id, String title, String description, LocalDateTime startTime, LocalDateTime endTime, String location, String status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static EventBuilder builder() {
        return new EventBuilder();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class EventBuilder {
        private Long id;
        private String title;
        private String description;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String location;
        private String status;
        private LocalDateTime createdAt;

        public EventBuilder id(Long id) { this.id = id; return this; }
        public EventBuilder title(String title) { this.title = title; return this; }
        public EventBuilder description(String description) { this.description = description; return this; }
        public EventBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public EventBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public EventBuilder location(String location) { this.location = location; return this; }
        public EventBuilder status(String status) { this.status = status; return this; }
        public EventBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Event build() {
            return new Event(id, title, description, startTime, endTime, location, status, createdAt);
        }
    }
}
