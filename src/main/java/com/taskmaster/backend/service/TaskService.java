package com.taskmaster.backend.service;

import com.taskmaster.backend.dto.TaskRequest;
import com.taskmaster.backend.model.Task;
import com.taskmaster.backend.model.TaskStatus;
import com.taskmaster.backend.model.User;
import com.taskmaster.backend.repository.TaskRepository;
import com.taskmaster.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    // Helper to get currently logged in user
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public List<Task> getAllTasks() {
        return taskRepository.findByUserId(getCurrentUser().getId());
    }

    public Task createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCreatedAt(LocalDateTime.now());
        task.setDueDate(request.getDueDate());
        
        // Default to TODO if not provided
        if (request.getStatus() != null) {
            task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
        } else {
            task.setStatus(TaskStatus.TODO);
        }

        task.setUser(getCurrentUser());
        return taskRepository.save(task);
    }
    
    // We will add Update/Delete later
}