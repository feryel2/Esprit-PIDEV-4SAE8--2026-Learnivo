package com.learnivo.demo.repository;

import com.learnivo.demo.entity.LiveEventCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiveEventCheckInRepository extends JpaRepository<LiveEventCheckIn, Long> {

    List<LiveEventCheckIn> findByEvent_IdOrderByCreatedAtDesc(Long eventId);

    @Query("""
            SELECT DISTINCT ci FROM LiveEventCheckIn ci, EventRegistration er
            WHERE er.event.id = ci.event.id AND er.student.id = :studentId
            AND UPPER(TRIM(er.status)) <> 'CANCELLED'
            AND NOT EXISTS (
                SELECT 1 FROM LiveEventCheckInAck a
                WHERE a.checkIn.id = ci.id AND a.student.id = :studentId
            )
            ORDER BY ci.createdAt DESC
            """)
    List<LiveEventCheckIn> findPendingForStudent(@Param("studentId") Long studentId);
}
