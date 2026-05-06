package com.learnivo.demo.repository;

import com.learnivo.demo.entity.CrosswordPuzzle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrosswordRepository extends JpaRepository<CrosswordPuzzle, Long> {
}
