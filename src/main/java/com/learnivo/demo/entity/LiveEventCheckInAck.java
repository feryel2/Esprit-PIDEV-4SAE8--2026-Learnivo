package com.learnivo.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "live_event_check_in_acks",
        uniqueConstraints = @UniqueConstraint(name = "uk_check_in_student", columnNames = {"check_in_id", "student_id"})
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LiveEventCheckInAck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "check_in_id", nullable = false)
    private LiveEventCheckIn checkIn;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "responded_at", nullable = false)
    private LocalDateTime respondedAt;

    @PrePersist
    protected void onCreate() {
        if (respondedAt == null) {
            respondedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LiveEventCheckIn getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LiveEventCheckIn checkIn) {
        this.checkIn = checkIn;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}
