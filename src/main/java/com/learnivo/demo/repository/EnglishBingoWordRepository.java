package com.learnivo.demo.repository;

import com.learnivo.demo.entity.EnglishBingoWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnglishBingoWordRepository extends JpaRepository<EnglishBingoWord, Long> {

    @Query("SELECT DISTINCT w FROM EnglishBingoWord w LEFT JOIN FETCH w.correctClasses")
    List<EnglishBingoWord> findAllWithClasses();

    @Query("SELECT w FROM EnglishBingoWord w JOIN FETCH w.correctClasses WHERE w.id = :id")
    java.util.Optional<EnglishBingoWord> findByIdWithClasses(@Param("id") Long id);
}
