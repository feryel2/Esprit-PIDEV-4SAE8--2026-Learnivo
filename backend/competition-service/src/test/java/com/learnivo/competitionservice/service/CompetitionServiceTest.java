package com.learnivo.competitionservice.service;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.entity.Participant;
import com.learnivo.competitionservice.exception.ResourceNotFoundException;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CompetitionService – Unit Tests")
class CompetitionServiceTest {

    @Mock
    private CompetitionRepository competitionRepository;

    @InjectMocks
    private CompetitionService competitionService;

    private Competition sampleCompetition;

    @BeforeEach
    void setUp() {
        sampleCompetition = Competition.builder()
                .id(1L)
                .title("Math Olympiad 2025")
                .slug("math-olympiad-2025")
                .status(Competition.Status.UPCOMING)
                .maxParticipants(3)
                .participants(new ArrayList<>())
                .rounds(new ArrayList<>())
                .tags(new ArrayList<>())
                .build();
    }

    // ── findAll ────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll() returns ordered list from repository")
    void findAll_returnsList() {
        when(competitionRepository.findAllByOrderByIdDesc()).thenReturn(List.of(sampleCompetition));

        List<Competition> result = competitionService.findAll();

        assertThat(result).hasSize(1).containsExactly(sampleCompetition);
        verify(competitionRepository).findAllByOrderByIdDesc();
    }

    // ── findById ────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById() returns competition when found")
    void findById_found() {
        when(competitionRepository.findById(1L)).thenReturn(Optional.of(sampleCompetition));

        Competition result = competitionService.findById(1L);

        assertThat(result).isEqualTo(sampleCompetition);
    }

    @Test
    @DisplayName("findById() throws ResourceNotFoundException when not found")
    void findById_notFound() {
        when(competitionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> competitionService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ── save ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("save() auto-generates slug from title when slug is blank")
    void save_generatesSlugFromTitle() {
        Competition comp = Competition.builder()
                .title("Spring Boot Hackathon")
                .participants(new ArrayList<>())
                .rounds(new ArrayList<>())
                .tags(new ArrayList<>())
                .build();
        when(competitionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Competition result = competitionService.save(comp);

        assertThat(result.getSlug()).isEqualTo("spring-boot-hackathon");
    }

    @Test
    @DisplayName("save() does not overwrite an existing slug")
    void save_preservesExistingSlug() {
        sampleCompetition.setSlug("my-custom-slug");
        when(competitionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Competition result = competitionService.save(sampleCompetition);

        assertThat(result.getSlug()).isEqualTo("my-custom-slug");
    }

    // ── register ────────────────────────────────────────────────────────

    @Test
    @DisplayName("register() successfully adds a participant")
    void register_success() {
        when(competitionRepository.findById(1L)).thenReturn(Optional.of(sampleCompetition));
        when(competitionRepository.save(any())).thenReturn(sampleCompetition);

        Participant result = competitionService.register(1L, "Alice", "alice@example.com");

        assertThat(result.getName()).isEqualTo("Alice");
        assertThat(result.getEmail()).isEqualTo("alice@example.com");
        assertThat(result.getStatus()).isEqualTo(Participant.Status.REGISTERED);
        assertThat(sampleCompetition.getParticipants()).hasSize(1);
    }

    @Test
    @DisplayName("register() throws when competition is COMPLETED")
    void register_throwsWhenCompleted() {
        sampleCompetition.setStatus(Competition.Status.COMPLETED);
        when(competitionRepository.findById(1L)).thenReturn(Optional.of(sampleCompetition));

        assertThatThrownBy(() -> competitionService.register(1L, "Alice", "alice@example.com"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ended");
    }

    @Test
    @DisplayName("register() throws when email is already registered")
    void register_throwsWhenAlreadyRegistered() {
        sampleCompetition.getParticipants().add(
                Participant.builder().name("Alice").email("alice@example.com").build());
        when(competitionRepository.findById(1L)).thenReturn(Optional.of(sampleCompetition));

        assertThatThrownBy(() -> competitionService.register(1L, "Alice", "alice@example.com"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already registered");
    }

    @Test
    @DisplayName("register() throws when max capacity is reached")
    void register_throwsWhenCapacityReached() {
        // Fill to max (3)
        sampleCompetition.getParticipants().add(
                Participant.builder().name("A").email("a@test.com").build());
        sampleCompetition.getParticipants().add(
                Participant.builder().name("B").email("b@test.com").build());
        sampleCompetition.getParticipants().add(
                Participant.builder().name("C").email("c@test.com").build());
        when(competitionRepository.findById(1L)).thenReturn(Optional.of(sampleCompetition));

        assertThatThrownBy(() -> competitionService.register(1L, "D", "d@test.com"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("capacity");
    }

    // ── delete ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete() clears all collections then deletes the competition")
    void delete_clearsCollectionsAndDeletes() {
        sampleCompetition.getParticipants().add(
                Participant.builder().name("Alice").email("alice@example.com").build());
        sampleCompetition.getTags().add("coding");

        when(competitionRepository.findById(1L)).thenReturn(Optional.of(sampleCompetition));

        competitionService.delete(1L);

        assertThat(sampleCompetition.getParticipants()).isEmpty();
        assertThat(sampleCompetition.getRounds()).isEmpty();
        assertThat(sampleCompetition.getTags()).isEmpty();
        verify(competitionRepository).deleteById(1L);
    }
}
