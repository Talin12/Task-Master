package com.taskmaster.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    private String status;
    private LocalDateTime dueDate;

    public TaskRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}