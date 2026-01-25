package com.taskmaster.backend.repository;

import com.taskmaster.backend.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Modified to return a Page instead of a List
    Page<Task> findByUserId(Long userId, Pageable pageable);
    
    // Ensure a user can only delete/update their own task
    Optional<Task> findByIdAndUserId(Long id, Long userId);
}