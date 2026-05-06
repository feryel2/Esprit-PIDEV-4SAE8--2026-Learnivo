package com.learnivo.demo.controller;

import com.learnivo.demo.dto.*;
import com.learnivo.demo.service.LiveEventCheckInService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class LiveEventCheckInController {

    private final LiveEventCheckInService liveEventCheckInService;

    public LiveEventCheckInController(LiveEventCheckInService liveEventCheckInService) {
        this.liveEventCheckInService = liveEventCheckInService;
    }

    @PostMapping("/api/events/{eventId}/live-check-ins")
    public ResponseEntity<LiveEventCheckInSummaryResponse> create(
            @PathVariable Long eventId,
            @RequestBody(required = false) LiveEventCheckInCreateRequest request) {
        LiveEventCheckInSummaryResponse body = liveEventCheckInService.createForEvent(eventId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping("/api/events/{eventId}/live-check-ins")
    public ResponseEntity<List<LiveEventCheckInSummaryResponse>> listForEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(liveEventCheckInService.listForEvent(eventId));
    }

    @GetMapping("/api/events/{eventId}/live-check-ins/{checkInId}/participants")
    public ResponseEntity<List<LiveEventCheckInParticipantStatusResponse>> participants(
            @PathVariable Long eventId,
            @PathVariable Long checkInId) {
        return ResponseEntity.ok(liveEventCheckInService.participantStatuses(eventId, checkInId));
    }

    @GetMapping("/api/live-check-ins/pending")
    public ResponseEntity<List<LiveEventCheckInPendingResponse>> pending(
            @RequestParam Long studentId) {
        return ResponseEntity.ok(liveEventCheckInService.listPendingForStudent(studentId));
    }

    @PostMapping("/api/live-check-ins/{checkInId}/ack")
    public ResponseEntity<Void> acknowledge(
            @PathVariable Long checkInId,
            @Valid @RequestBody LiveEventCheckInStudentAckRequest body) {
        liveEventCheckInService.acknowledge(checkInId, body);
        return ResponseEntity.noContent().build();
    }
}
