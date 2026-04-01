package org.example.imedbackend.repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import org.example.imedbackend.entity.InternshipEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface InternshipEvaluationRepository extends JpaRepository<InternshipEvaluation, Long> {
    @Query("select ie from InternshipEvaluation ie join ie.application ia")
    List<InternshipEvaluation> findAllWithExistingApplication();

    @Query("select ie from InternshipEvaluation ie join ie.application ia where ie.id = :id")
    Optional<InternshipEvaluation> findByIdWithExistingApplication(Long id);

    @Modifying
    @Query(value = "update internship_evaluations set score = :score, feedback = :feedback, evaluated_at = :evaluatedAt, application_id = :applicationId where id = :id", nativeQuery = true)
    int updateByIdNative(Long id, double score, String feedback, LocalDateTime evaluatedAt, Long applicationId);

    @Modifying
    @Query(value = "delete from internship_evaluations where id = :id", nativeQuery = true)
    int deleteByIdNative(Long id);
}
