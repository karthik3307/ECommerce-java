package com.shop.backend.controller;

import com.shop.backend.model.User;
import com.shop.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;

    public AuthController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null || user.getName() == null
                || user.getEmail().isBlank() || user.getPassword().isBlank() || user.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email and password are required"));
        }
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }
        user.setRole("CUSTOMER"); // nobody can register as admin
        return ResponseEntity.ok(userRepo.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        Optional<User> user = userRepo.findByEmail(body.get("email"));
        if (user.isPresent() && user.get().getPassword().equals(body.get("password"))) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }
}
