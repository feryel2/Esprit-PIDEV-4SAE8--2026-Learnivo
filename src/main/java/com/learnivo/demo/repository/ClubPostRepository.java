package com.learnivo.demo.repository;

import com.learnivo.demo.entity.ClubPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubPostRepository extends JpaRepository<ClubPost, Long> {
    List<ClubPost> findByClubIdOrderByCreatedAtDesc(Long clubId);
}
