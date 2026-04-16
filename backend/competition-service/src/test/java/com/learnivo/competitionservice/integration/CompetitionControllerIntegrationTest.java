package com.learnivo.competitionservice.integration;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.entity.Participant;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DisplayName("Competition Controller – Integration Tests")
public class CompetitionControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CompetitionRepository competitionRepository;

    private Long compId;

    @BeforeEach
    void setUp() {
        competitionRepository.deleteAll();

        Competition comp = Competition.builder()
                .title("Integration Test Comp")
                .slug("integration-test-comp")
                .status(Competition.Status.ONGOING)
                .participants(new ArrayList<>())
                .build();

        comp.getParticipants().add(Participant.builder().name("User 1").email("u1@test.com").score(100).status(Participant.Status.REGISTERED).build());
        comp.getParticipants().add(Participant.builder().name("User 2").email("u2@test.com").score(80).status(Participant.Status.REGISTERED).build());
        comp.getParticipants().add(Participant.builder().name("User 3").email("u3@test.com").score(60).status(Participant.Status.REGISTERED).build());
        comp.getParticipants().add(Participant.builder().name("User 4").email("u4@test.com").score(40).status(Participant.Status.REGISTERED).build());

        Competition saved = competitionRepository.save(comp);
        compId = saved.getId();
    }

    @Test
    @DisplayName("POST /publish success - Marks top 3 as winners and status as COMPLETED")
    void publishResults_integrationSuccess() {
        ResponseEntity<Competition> response = restTemplate.postForEntity("/api/competitions/" + compId + "/publish", null, Competition.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Competition updated = response.getBody();

        assertThat(updated).isNotNull();
        assertThat(updated.getStatus()).isEqualTo(Competition.Status.COMPLETED);
        assertThat(updated.getResultsPublished()).isTrue();

        // Check winners in DB
        Competition dbComp = competitionRepository.findByIdWithParticipants(compId).orElseThrow();
        long winnersCount = dbComp.getParticipants().stream()
                .filter(p -> p.getStatus() == Participant.Status.WINNER)
                .count();

        assertThat(winnersCount).isEqualTo(3);
        
        // Ensure the one with 100 score is a winner
        Participant top = dbComp.getParticipants().stream()
                .filter(p -> p.getEmail().equals("u1@test.com"))
                .findFirst().orElseThrow();
        assertThat(top.getStatus()).isEqualTo(Participant.Status.WINNER);
    }
}
