package com.civicai.backend.controller;

import com.civicai.backend.config.JwtUtil;
import com.civicai.backend.dto.AuthDtos;
import com.civicai.backend.entity.User;
import com.civicai.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "An account with this email already exists"));
        }

        String role = (request.getRole() != null && request.getRole().toUpperCase().contains("ADMIN"))
                ? "ROLE_ADMIN"
                : "ROLE_CITIZEN";

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .phone(request.getPhone())
                .department(request.getDepartment())
                .wardNumber(request.getWardNumber())
                .build();

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole(), saved.getName(), saved.getId());

        return ResponseEntity.ok(AuthDtos.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .phone(saved.getPhone())
                .department(saved.getDepartment())
                .wardNumber(saved.getWardNumber())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName(), user.getId());

        return ResponseEntity.ok(AuthDtos.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .wardNumber(user.getWardNumber())
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "No authentication token provided"));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired token"));
        }

        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .map(u -> ResponseEntity.ok(AuthDtos.AuthResponse.builder()
                        .token(token)
                        .tokenType("Bearer")
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .phone(u.getPhone())
                        .department(u.getDepartment())
                        .wardNumber(u.getWardNumber())
                        .build()))
                .orElse(ResponseEntity.status(404).build());
    }
}
