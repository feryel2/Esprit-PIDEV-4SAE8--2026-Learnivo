package com.learnivo.demo.service;

import com.learnivo.demo.dto.EventRegistrationRequest;
import com.learnivo.demo.dto.EventRegistrationResponse;
import com.learnivo.demo.entity.Event;
import com.learnivo.demo.entity.EventRegistration;
import com.learnivo.demo.entity.Student;
import com.learnivo.demo.repository.EventRegistrationRepository;
import com.learnivo.demo.repository.EventRepository;
import com.learnivo.demo.repository.StudentRepository;
import com.learnivo.demo.repository.ClubMembershipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final ClubMembershipRepository clubMembershipRepository;
    private final EventService eventService;

    public EventRegistrationService(EventRegistrationRepository registrationRepository,
                                    EventRepository eventRepository,
                                    StudentRepository studentRepository,
                                    ClubMembershipRepository clubMembershipRepository,
                                    EventService eventService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
        this.clubMembershipRepository = clubMembershipRepository;
        this.eventService = eventService;
    }

    public List<EventRegistration> findAll() {
        return registrationRepository.findAll();
    }

    public EventRegistration findById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event registration not found with id: " + id));
    }

    /** Une ligne d’inscription avec event + student chargés (évite LazyInitializationException). */
    private Optional<EventRegistration> findFetchedByEventAndStudent(Long eventId, Long studentId) {
        List<EventRegistration> list = registrationRepository.findAllByEventIdAndStudentIdFetched(eventId, studentId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    /** Réponse API sans parcourir les proxies lazy de l’entité persistée. */
    private static EventRegistrationResponse toResponse(Event event, Student student, EventRegistration reg) {
        return new EventRegistrationResponse(
                reg.getId(),
                reg.getRegisteredAt(),
                reg.getStatus(),
                event.getId(),
                student.getId(),
                student.getName(),
                event.getTitle(),
                event.getStartTime()
        );
    }

    @Transactional
    public EventRegistrationResponse create(EventRegistrationRequest request) {
        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Événement introuvable (id: " + request.eventId() + ")."));
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new IllegalArgumentException("Étudiant introuvable (id: " + request.studentId() + ")."));

        boolean asAdmin = Boolean.TRUE.equals(request.adminOverride());
        if (!asAdmin) {
            // Vérification 1: Événement accessible à l'étudiant
            if (!eventService.isEventAccessibleToStudent(event.getId(), student.getId())) {
                throw new IllegalArgumentException("Événement non accessible pour cet étudiant (club / droits).");
            }

            // Vérification 2: Événement n'est pas plein
            if (event.isFull()) {
                throw new IllegalArgumentException("Événement complet.");
            }

            // Vérification 3: Événement n'a pas déjà commencé
            if (event.getStartTime() != null && event.getStartTime().isBefore(java.time.LocalDateTime.now())) {
                throw new IllegalArgumentException("L'événement a déjà commencé.");
            }
        }

        Optional<EventRegistration> existingOpt = findFetchedByEventAndStudent(event.getId(), student.getId());
        if (existingOpt.isPresent()) {
            EventRegistration existing = existingOpt.get();
            if (asAdmin) {
                return toResponse(event, student, existing);
            }
            throw new IllegalArgumentException("Cet étudiant est déjà inscrit à cet événement.");
        }

        EventRegistration r = new EventRegistration();
        r.setRegisteredAt(request.registeredAt());
        r.setStatus(request.status());
        r.setEvent(event);
        r.setStudent(student);
        registrationRepository.saveAndFlush(r);

        updateStudentMembershipStatus(event, student);

        return toResponse(event, student, r);
    }

    @Transactional
    public EventRegistrationResponse update(Long id, EventRegistrationRequest request) {
        EventRegistration r = findById(id);
        r.setRegisteredAt(request.registeredAt());
        r.setStatus(request.status());
        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + request.eventId()));
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + request.studentId()));
        r.setEvent(event);
        r.setStudent(student);
        EventRegistration saved = registrationRepository.saveAndFlush(r);
        return toResponse(event, student, saved);
    }

    @Transactional(readOnly = true)
    public List<EventRegistrationResponse> findAllResponse() {
        return registrationRepository.findAll().stream()
                .map(EventRegistrationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventRegistrationResponse> findByStudentId(Long studentId) {
        return registrationRepository.findByStudent_Id(studentId).stream()
                .map(EventRegistrationResponse::from)
                .collect(Collectors.toList());
    }

    /** Liste des participants d'un événement (pour délivrance de certificats). */
    @Transactional(readOnly = true)
    public List<EventRegistrationResponse> findByEventId(Long eventId) {
        return registrationRepository.findByEventIdWithStudent(eventId).stream()
                .map(EventRegistrationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventRegistrationResponse findByIdResponse(Long id) {
        EventRegistration r = findById(id);
        return EventRegistrationResponse.from(r);
    }

    @Transactional
    public void delete(Long id) {
        EventRegistration r = findById(id);
        registrationRepository.delete(r);
    }

    /**
     * Met à jour le statut de membership de l'étudiant si nécessaire.
     * Si l'étudiant n'est pas membre du club de l'événement, il peut être invité à rejoindre.
     */
    private void updateStudentMembershipStatus(Event event, Student student) {
        try {
            if (event.getClub() != null) {
                boolean isMember = clubMembershipRepository.findByClubIdAndStudentId(event.getClub().getId(), student.getId()) != null;
                if (!isMember) {
                    String clubName = event.getClub().getName() != null ? event.getClub().getName() : "";
                    System.out.println("Student " + student.getName() + " registered for event from club "
                            + clubName + " but is not a member.");
                }
            }
        } catch (RuntimeException ignored) {
            // Ne pas faire échouer l'inscription si le chargement club / membership pose problème
        }
    }

    /**
     * Retourne le nombre de places disponibles pour un événement.
     */
    @Transactional(readOnly = true)
    public int getAvailablePlaces(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        if (event.getMaxParticipants() == null) {
            return Integer.MAX_VALUE;
        }
        int registeredCount = registrationRepository.findByEvent_Id(eventId).size();
        return event.getMaxParticipants() - registeredCount;
    }

    /**
     * Vérifie si un étudiant peut s'inscrire à un événement (vérifications complètes).
     */
    @Transactional(readOnly = true)
    public boolean canStudentRegister(Long eventId, Long studentId) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            
            if (!eventService.isEventAccessibleToStudent(event.getId(), student.getId())) {
                return false;
            }
            
            if (event.isFull()) {
                return false;
            }
            
            if (event.getStartTime().isBefore(java.time.LocalDateTime.now())) {
                return false;
            }
            
            return findFetchedByEventAndStudent(event.getId(), student.getId()).isEmpty();
        } catch (Exception e) {
            return false;
        }
    }
}
