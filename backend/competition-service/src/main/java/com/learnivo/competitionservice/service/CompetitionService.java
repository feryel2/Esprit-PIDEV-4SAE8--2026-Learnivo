package com.learnivo.competitionservice.service;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.entity.Participant;
import com.learnivo.competitionservice.exception.ResourceNotFoundException;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    // ── Lecture ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Competition> findAll() {
        return competitionRepository.findAllByOrderByIdDesc();
    }

    @Transactional(readOnly = true)
    public Competition findById(Long id) {
        return competitionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Competition non trouvée avec l'id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Competition> findByStatus(String status) {
        return competitionRepository.findByStatus(
                Competition.Status.valueOf(status.toUpperCase()));
    }

    // ── Création ───────────────────────────────────────────────────────

    public Competition save(Competition competition) {
        if (competition.getSlug() == null || competition.getSlug().isBlank()) {
            competition.setSlug(competition.getTitle().toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("(^-|-$)", ""));
        }
        return competitionRepository.save(competition);
    }

    // ── Mise à jour ────────────────────────────────────────────────────

    public Competition update(Long id, Competition updated) {
        Competition existing = findById(id);

        existing.setTitle(updated.getTitle());
        existing.setSlug(updated.getSlug());
        existing.setDescription(updated.getDescription());
        existing.setImage(updated.getImage());
        existing.setCategory(updated.getCategory());
        existing.setPrize(updated.getPrize());
        existing.setDeadline(updated.getDeadline());
        existing.setStatus(updated.getStatus());
        existing.setMaxParticipants(updated.getMaxParticipants());
        existing.setRules(updated.getRules());
        existing.setResultsPublished(updated.getResultsPublished() != null ? updated.getResultsPublished() : false);

        if (updated.getTags() != null) {
            existing.getTags().clear();
            existing.getTags().addAll(updated.getTags());
        }

        existing.getRounds().clear();
        if (updated.getRounds() != null) {
            existing.getRounds().addAll(updated.getRounds());
        }

        existing.getParticipants().clear();
        if (updated.getParticipants() != null) {
            existing.getParticipants().addAll(updated.getParticipants());
        }

        return competitionRepository.save(existing);
    }

    // ── Suppression ────────────────────────────────────────────────────

    public void delete(Long id) {
        Competition existing = findById(id);
        // Vider les collections avant suppression pour éviter contraintes FK
        existing.getParticipants().clear();
        existing.getRounds().clear();
        existing.getTags().clear();
        competitionRepository.save(existing);
        competitionRepository.deleteById(id);
    }

    // ── Inscription user public ────────────────────────────────────────

    public Participant register(Long competitionId, String name, String email) {
        Competition comp = findById(competitionId);

        if (comp.getStatus() == Competition.Status.COMPLETED)
            throw new IllegalStateException("This competition has already ended.");

        boolean already = comp.getParticipants().stream()
                .anyMatch(p -> p.getEmail().equalsIgnoreCase(email));
        if (already)
            throw new IllegalStateException("This email is already registered.");

        if (comp.getMaxParticipants() != null
                && comp.getParticipants().size() >= comp.getMaxParticipants())
            throw new IllegalStateException("Maximum capacity reached.");

        Participant participant = Participant.builder()
                .name(name)
                .email(email)
                .registeredAt(LocalDate.now().toString())
                .status(Participant.Status.REGISTERED)
                .build();

        comp.getParticipants().add(participant);
        competitionRepository.save(comp);
        return participant;
    }
}
