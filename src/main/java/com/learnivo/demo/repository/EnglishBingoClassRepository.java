package com.learnivo.demo.repository;

import com.learnivo.demo.entity.EnglishBingoClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnglishBingoClassRepository extends JpaRepository<EnglishBingoClass, Long> {

    List<EnglishBingoClass> findAllByOrderByIdAsc();
}
