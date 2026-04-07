package com.learnivo.competitionservice.scheduler;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * Scheduler qui tourne toutes les 30 minutes.
 * Met à jour automatiquement le statut des compétitions :
 *   UPCOMING  → ONGOING   si startDate <= maintenant && deadline > maintenant
 *   UPCOMING  → COMPLETED si deadline <= maintenant (et pas de startDate)
 *   ONGOING   → COMPLETED si deadline <= maintenant
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CompetitionStatusScheduler {

    private final CompetitionRepository competitionRepository;

    @Scheduled(fixedRate = 1_800_000) // toutes les 30 minutes
    @Transactional
    public void updateStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Competition> all = competitionRepository.findAll();
        int updated = 0;

        for (Competition comp : all) {
            Competition.Status newStatus = computeStatus(comp, now);
            if (newStatus != null && newStatus != comp.getStatus()) {
                log.info("[STATUS] '{}' : {} → {}", comp.getTitle(), comp.getStatus(), newStatus);
                comp.setStatus(newStatus);
                competitionRepository.save(comp);
                updated++;
            }
        }

        if (updated > 0) {
            log.info("[STATUS] {} compétition(s) mise(s) à jour.", updated);
        }
    }

    /**
     * Retourne le nouveau statut calculé, ou null si aucun changement nécessaire.
     */
    Competition.Status computeStatus(Competition comp, LocalDateTime now) {
        LocalDateTime deadline = parse(comp.getDeadline());
        if (deadline == null) return null; // pas de deadline, on ne touche pas

        // deadline passée → COMPLETED (peu importe le statut courant sauf déjà COMPLETED)
        if (!now.isBefore(deadline)) {
            return comp.getStatus() != Competition.Status.COMPLETED
                    ? Competition.Status.COMPLETED
                    : null;
        }

        // deadline dans le futur
        LocalDateTime startDate = parse(comp.getStartDate());

        if (startDate != null) {
            // startDate définie : UPCOMING → ONGOING si startDate passée
            if (!now.isBefore(startDate) && comp.getStatus() == Competition.Status.UPCOMING) {
                return Competition.Status.ONGOING;
            }
        }
        // Pas de changement nécessaire
        return null;
    }

    private LocalDateTime parse(String iso) {
        if (iso == null || iso.isBlank()) return null;
        try {
            return LocalDateTime.parse(iso, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e) {
            try {
                return LocalDateTime.parse(iso + "T00:00:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            } catch (DateTimeParseException ex) {
                return null;
            }
        }
    }
}
