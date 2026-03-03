package com.learnivo.competitionservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String registeredAt;
    private Integer score;

    @Enumerated(EnumType.STRING)
    private Status status = Status.REGISTERED;

    public enum Status {
        REGISTERED, WINNER, DISQUALIFIED;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static Status from(String value) {
            return Status.valueOf(value.toUpperCase());
        }
    }
}
