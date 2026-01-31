package com.taskmaster.backend.service;

import com.taskmaster.backend.dto.TaskRequest;
import com.taskmaster.backend.model.Task;
import com.taskmaster.backend.model.TaskStatus;
import com.taskmaster.backend.model.User;
import com.taskmaster.backend.repository.TaskRepository;
import com.taskmaster.backend.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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

    @Cacheable(value = "tasks", key = "T(org.springframework.security.core.context.SecurityContextHolder).getContext().getAuthentication().getName() + '-' + #status + '-' + #pageable.pageNumber")
    public Page<Task> getAllTasks(String status, Pageable pageable) {
        User user = getCurrentUser();
        if (status != null && !status.isEmpty()) {
            try {
                TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
                return taskRepository.findByUserIdAndStatus(user.getId(), taskStatus, pageable);
            } catch (IllegalArgumentException e) {
                // Ignore invalid status
            }
        }
        return taskRepository.findByUserId(user.getId(), pageable);
    }

    @CacheEvict(value = "tasks", allEntries = true)
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
    @CacheEvict(value = "tasks", allEntries = true)
    public Task updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        
        if (request.getStatus() != null) {
            try {
                task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {}
        }
        
        return taskRepository.save(task);
    }

    @CacheEvict(value = "tasks", allEntries = true)
    public void deleteTask(Long id) {
        Task task = taskRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Map<String, Long> getTaskAnalytics() {
        List<Object[]> results = taskRepository.countTasksByStatus(getCurrentUser().getId());
        Map<String, Long> stats = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) stats.put(status.name(), 0L);
        for (Object[] result : results) stats.put(((TaskStatus) result[0]).name(), (Long) result[1]);
        stats.put("TOTAL_TASKS", stats.values().stream().mapToLong(Long::longValue).sum());
        return stats;
    }
}