package com.learnivo.competitionservice.scheduler;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * Runs every 30 seconds to transition competition statuses automatically:
 *   UPCOMING → ONGOING   when now >= startDate
 *   ONGOING  → COMPLETED when now >= deadline
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CompetitionStatusScheduler {

    private final CompetitionRepository competitionRepository;

    @Scheduled(fixedRate = 30_000) // every 30 seconds
    public void updateStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Competition> all = competitionRepository.findAll();

        for (Competition c : all) {
            Competition.Status initialStatus = c.getStatus();
            Competition.Status newStatus = computeStatus(c, now);
            if (newStatus != null && newStatus != initialStatus) {
                c.setStatus(newStatus);
                competitionRepository.save(c);
                log.info("Competition '{}' (id={}) changed status: {} -> {}", 
                        c.getTitle(), c.getId(), initialStatus, newStatus);
            }
        }
    }

    public Competition.Status computeStatus(Competition c, LocalDateTime now) {
        if (c.getStatus() == Competition.Status.COMPLETED) {
            return null;
        }

        LocalDateTime start = parseDate(c.getStartDate());
        LocalDateTime end = parseDate(c.getDeadline());

        if (end != null && now.isAfter(end)) {
            return Competition.Status.COMPLETED;
        } else if (start != null && now.isAfter(start) && (end == null || now.isBefore(end))) {
            if (c.getStatus() == Competition.Status.UPCOMING) {
                return Competition.Status.ONGOING;
            }
        }

        return null;
    }

    /** Parses an ISO date string, handling both LocalDateTime and ZonedDateTime formats */
    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            if (dateStr.endsWith("Z") || dateStr.contains("+")) {
                return ZonedDateTime.parse(dateStr).toLocalDateTime();
            }
            return LocalDateTime.parse(dateStr);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
