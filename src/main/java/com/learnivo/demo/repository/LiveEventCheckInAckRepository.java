package com.learnivo.demo.repository;

import com.learnivo.demo.entity.LiveEventCheckInAck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiveEventCheckInAckRepository extends JpaRepository<LiveEventCheckInAck, Long> {

    boolean existsByCheckIn_IdAndStudent_Id(Long checkInId, Long studentId);

    long countByCheckIn_Id(Long checkInId);

    @Query("SELECT a FROM LiveEventCheckInAck a JOIN FETCH a.student WHERE a.checkIn.id = :checkInId")
    List<LiveEventCheckInAck> findByCheckInIdWithStudent(@Param("checkInId") Long checkInId);
}
