package com.learnivo.competitionservice.speech.repository;

import com.learnivo.competitionservice.speech.entity.SpeechTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeechTestResultRepository extends JpaRepository<SpeechTestResult, Long> {
    List<SpeechTestResult> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
