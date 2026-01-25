package com.taskmaster.backend.repository;

import com.taskmaster.backend.model.Task;
import com.taskmaster.backend.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByUserId(Long userId, Pageable pageable);
    
    // New filtering method
    Page<Task> findByUserIdAndStatus(Long userId, TaskStatus status, Pageable pageable);
    
    Optional<Task> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT t.status, COUNT(t) FROM Task t WHERE t.user.id = :userId GROUP BY t.status")
    List<Object[]> countTasksByStatus(Long userId);
}