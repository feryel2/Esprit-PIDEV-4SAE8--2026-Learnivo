package com.learnivo.competitionservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "competition_rounds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitionRound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String startDate;
    private String endDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status { PENDING, ACTIVE, DONE;
        @com.fasterxml.jackson.annotation.JsonCreator
        public static Participant.Status from(String value) {
            return Participant.Status.valueOf(value.toUpperCase());
        }}
}
