package com.taskmaster.backend.service;

import com.taskmaster.backend.dto.TaskRequest;
import com.taskmaster.backend.model.Task;
import com.taskmaster.backend.model.TaskStatus;
import com.taskmaster.backend.model.User;
import com.taskmaster.backend.repository.TaskRepository;
import com.taskmaster.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findByUserId(getCurrentUser().getId(), pageable);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));
    }

    public Task createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCreatedAt(LocalDateTime.now());
        task.setDueDate(request.getDueDate());
        
        if (request.getStatus() != null) {
            try {
                task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                task.setStatus(TaskStatus.TODO);
            }
        } else {
            task.setStatus(TaskStatus.TODO);
        }

        task.setUser(getCurrentUser());
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, TaskRequest request) {
        Task task = getTaskById(id); // Checks ownership implicitly
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        
        if (request.getStatus() != null) {
            try {
                task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep old status if invalid
            }
        }
        
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }
}