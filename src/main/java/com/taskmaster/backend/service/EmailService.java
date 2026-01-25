package com.taskmaster.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to TaskMaster!");
            message.setText("Hi " + username + ",\n\nWelcome to TaskMaster. Your account has been successfully created.\n\nHappy Tasking!");
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't crash the user registration
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}