package com.learnivo.demo.service;

import com.learnivo.demo.dto.*;
import com.learnivo.demo.entity.Event;
import com.learnivo.demo.entity.EventRegistration;
import com.learnivo.demo.entity.LiveEventCheckIn;
import com.learnivo.demo.entity.LiveEventCheckInAck;
import com.learnivo.demo.entity.Student;
import com.learnivo.demo.repository.EventRegistrationRepository;
import com.learnivo.demo.repository.EventRepository;
import com.learnivo.demo.repository.LiveEventCheckInAckRepository;
import com.learnivo.demo.repository.LiveEventCheckInRepository;
import com.learnivo.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LiveEventCheckInService {

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final LiveEventCheckInRepository checkInRepository;
    private final LiveEventCheckInAckRepository ackRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;

    public LiveEventCheckInService(
            LiveEventCheckInRepository checkInRepository,
            LiveEventCheckInAckRepository ackRepository,
            EventRepository eventRepository,
            EventRegistrationRepository registrationRepository,
            StudentRepository studentRepository) {
        this.checkInRepository = checkInRepository;
        this.ackRepository = ackRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.studentRepository = studentRepository;
    }

    private static boolean registrationActive(EventRegistration r) {
        String s = r.getStatus();
        if (s == null) {
            return true;
        }
        return !"CANCELLED".equalsIgnoreCase(s.trim());
    }

    private static String fmt(LocalDateTime t) {
        return t == null ? null : t.format(ISO);
    }

    @Transactional
    public LiveEventCheckInSummaryResponse createForEvent(Long eventId, LiveEventCheckInCreateRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Événement introuvable."));
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(event.getStartTime()) || now.isAfter(event.getEndTime())) {
            throw new IllegalArgumentException(
                    "Un check-in en direct n'est possible que pendant l'événement (entre le début et la fin).");
        }
        String text = request != null && request.message() != null && !request.message().isBlank()
                ? request.message().trim()
                : "Merci de confirmer votre présence à cet événement en cochant la notification.";
        LiveEventCheckIn row = new LiveEventCheckIn();
        row.setEvent(event);
        row.setMessage(text);
        LiveEventCheckIn saved = checkInRepository.save(row);
        return toSummary(saved);
    }

    @Transactional(readOnly = true)
    public List<LiveEventCheckInSummaryResponse> listForEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Événement introuvable.");
        }
        return checkInRepository.findByEvent_IdOrderByCreatedAtDesc(eventId).stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    private LiveEventCheckInSummaryResponse toSummary(LiveEventCheckIn ci) {
        long responded = ackRepository.countByCheckIn_Id(ci.getId());
        long expected = registrationRepository.findByEvent_Id(ci.getEvent().getId()).stream()
                .filter(LiveEventCheckInService::registrationActive)
                .count();
        return new LiveEventCheckInSummaryResponse(
                ci.getId(),
                ci.getMessage(),
                fmt(ci.getCreatedAt()),
                responded,
                expected
        );
    }

    @Transactional(readOnly = true)
    public List<LiveEventCheckInPendingResponse> listPendingForStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Étudiant introuvable.");
        }
        List<LiveEventCheckIn> pending = checkInRepository.findPendingForStudent(studentId);
        List<LiveEventCheckInPendingResponse> out = new ArrayList<>();
        for (LiveEventCheckIn ci : pending) {
            Event ev = ci.getEvent();
            out.add(new LiveEventCheckInPendingResponse(
                    ci.getId(),
                    ev.getId(),
                    ev.getTitle(),
                    ci.getMessage(),
                    fmt(ci.getCreatedAt())
            ));
        }
        return out;
    }

    @Transactional
    public void acknowledge(Long checkInId, LiveEventCheckInStudentAckRequest body) {
        if (body == null || body.studentId() == null) {
            throw new IllegalArgumentException("studentId est obligatoire.");
        }
        Long studentId = body.studentId();
        LiveEventCheckIn checkIn = checkInRepository.findById(checkInId)
                .orElseThrow(() -> new IllegalArgumentException("Check-in introuvable."));
        if (ackRepository.existsByCheckIn_IdAndStudent_Id(checkInId, studentId)) {
            return;
        }
        List<EventRegistration> regRows = registrationRepository.findAllByEventIdAndStudentIdFetched(
                checkIn.getEvent().getId(), studentId);
        EventRegistration er = regRows.isEmpty() ? null : regRows.get(0);
        if (er == null) {
            throw new IllegalArgumentException("Vous n'êtes pas inscrit à cet événement.");
        }
        if (!registrationActive(er)) {
            throw new IllegalArgumentException("Inscription annulée : confirmation impossible.");
        }
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Étudiant introuvable."));
        LiveEventCheckInAck ack = new LiveEventCheckInAck();
        ack.setCheckIn(checkIn);
        ack.setStudent(student);
        ackRepository.save(ack);
    }

    @Transactional(readOnly = true)
    public List<LiveEventCheckInParticipantStatusResponse> participantStatuses(Long eventId, Long checkInId) {
        LiveEventCheckIn ci = checkInRepository.findById(checkInId)
                .orElseThrow(() -> new IllegalArgumentException("Check-in introuvable."));
        if (!ci.getEvent().getId().equals(eventId)) {
            throw new IllegalArgumentException("Ce check-in n'appartient pas à cet événement.");
        }
        List<EventRegistration> regs = registrationRepository.findByEventIdWithStudent(eventId).stream()
                .filter(LiveEventCheckInService::registrationActive)
                .collect(Collectors.toList());
        List<LiveEventCheckInAck> acks = ackRepository.findByCheckInIdWithStudent(checkInId);
        Map<Long, LocalDateTime> responded = new HashMap<>();
        for (LiveEventCheckInAck a : acks) {
            responded.put(a.getStudent().getId(), a.getRespondedAt());
        }
        List<LiveEventCheckInParticipantStatusResponse> rows = new ArrayList<>();
        for (EventRegistration r : regs) {
            Long sid = r.getStudent().getId();
            LocalDateTime at = responded.get(sid);
            rows.add(new LiveEventCheckInParticipantStatusResponse(
                    sid,
                    r.getStudent().getName(),
                    at != null,
                    at != null ? fmt(at) : null
            ));
        }
        rows.sort((a, b) -> Boolean.compare(b.present(), a.present()));
        return rows;
    }
}
