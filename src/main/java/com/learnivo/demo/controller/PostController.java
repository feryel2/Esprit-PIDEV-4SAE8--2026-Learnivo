package com.learnivo.demo.controller;

import com.learnivo.demo.entity.Club;
import com.learnivo.demo.entity.ClubPost;
import com.learnivo.demo.entity.Comment;
import com.learnivo.demo.repository.ClubPostRepository;
import com.learnivo.demo.repository.ClubRepository;
import com.learnivo.demo.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {

    @Autowired
    private ClubPostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ClubRepository clubRepository;

    // POSTS
    @GetMapping("/clubs/{clubId}/posts")
    public List<ClubPost> getClubPosts(@PathVariable Long clubId) {
        return postRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    @PostMapping("/clubs/{clubId}/posts")
    public ResponseEntity<ClubPost> createPost(@PathVariable Long clubId, @RequestBody ClubPost post) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        post.setClub(club);
        post.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(postRepository.save(post));
    }

    // COMMENTS
    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getPostComments(@PathVariable Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Comment> createComment(@PathVariable Long postId, @RequestBody Comment comment) {
        ClubPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(commentRepository.save(comment));
    }

    // FILE UPLOAD
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            Path uploadDir = Paths.get("./uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), path);

            String fileUrl = "http://localhost:8085/uploads/" + filename;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not upload file: " + e.getMessage());
        }
    }
}
