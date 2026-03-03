package com.learnivo.competitionservice.repository;

import com.learnivo.competitionservice.entity.Competition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {

    List<Competition> findByStatus(Competition.Status status);

    List<Competition> findByCategory(String category);

    List<Competition> findAllByOrderByIdDesc();
}
