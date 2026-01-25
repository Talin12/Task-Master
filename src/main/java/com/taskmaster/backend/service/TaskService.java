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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // New Analytics Method
    public Map<String, Long> getTaskAnalytics() {
        List<Object[]> results = taskRepository.countTasksByStatus(getCurrentUser().getId());
        Map<String, Long> stats = new HashMap<>();
        
        // Initialize all with 0
        for (TaskStatus status : TaskStatus.values()) {
            stats.put(status.name(), 0L);
        }
        
        // Fill with actual data
        for (Object[] result : results) {
            TaskStatus status = (TaskStatus) result[0];
            Long count = (Long) result[1];
            stats.put(status.name(), count);
        }
        
        // Add total count
        stats.put("TOTAL_TASKS", stats.values().stream().mapToLong(Long::longValue).sum());
        
        return stats;
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
        Task task = getTaskById(id);
        
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