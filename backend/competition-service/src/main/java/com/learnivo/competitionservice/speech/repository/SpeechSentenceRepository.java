package com.learnivo.competitionservice.speech.repository;

import com.learnivo.competitionservice.speech.entity.SpeechSentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpeechSentenceRepository extends JpaRepository<SpeechSentence, Long> {

    @Query(value = "SELECT * FROM speech_sentences ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<SpeechSentence> findRandom();

    @Query(value = "SELECT * FROM speech_sentences WHERE difficulty = ?1 ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<SpeechSentence> findRandomByDifficulty(String difficulty);
}
