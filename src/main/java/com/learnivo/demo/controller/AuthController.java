package com.learnivo.demo.controller;

import com.learnivo.demo.entity.Professor;
import com.learnivo.demo.entity.Student;
import com.learnivo.demo.repository.ProfessorRepository;
import com.learnivo.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email) {
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "STUDENT");
            response.put("email", student.get().getEmail());
            response.put("name", student.get().getName());
            response.put("id", student.get().getId());
            return ResponseEntity.ok(response);
        }

        Optional<Professor> professor = professorRepository.findByEmail(email);
        if (professor.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "PROFESSOR");
            response.put("email", professor.get().getEmail());
            response.put("name", professor.get().getName());
            response.put("id", professor.get().getId());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("User not found with email: " + email);
    }
}
