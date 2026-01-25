package com.taskmaster.backend.service;

import com.taskmaster.backend.dto.AuthRequest;
import com.taskmaster.backend.dto.AuthResponse;
import com.taskmaster.backend.dto.RegisterRequest;
import com.taskmaster.backend.model.Role;
import com.taskmaster.backend.model.User;
import com.taskmaster.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService; // Add this

    // Update Constructor
    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, 
                                 JwtService jwtService, AuthenticationManager authenticationManager,
                                 EmailService emailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        
        repository.save(user);
        
        // Trigger Email (External Integration)
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
        
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }
}