package com.esprit.quizservice.repository;

import com.esprit.quizservice.domain.QuizStatus;
import com.esprit.quizservice.entity.Quiz;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Optional<Quiz> findFirstByCourseIgnoreCaseAndStatusOrderByUpdatedAtDesc(String course, QuizStatus status);

    @Query("""
            select quiz
            from Quiz quiz
            where lower(quiz.course) = lower(:course)
              and quiz.status = :status
              and (quiz.publishAt is null or quiz.publishAt <= :publishedBefore)
            order by quiz.updatedAt desc
            """)
    List<Quiz> findAvailableByCourseAndStatus(
            @Param("course") String course,
            @Param("status") QuizStatus status,
            @Param("publishedBefore") Instant publishedBefore
    );

    List<Quiz> findByCourseIgnoreCase(String course);

    List<Quiz> findByCourseIgnoreCaseAndStatusAndIdNot(String course, QuizStatus status, Long id);
}
