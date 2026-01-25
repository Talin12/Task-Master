package com.taskmaster.backend.controller;

import com.taskmaster.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final TaskService taskService;

    public AnalyticsController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Long>> getAnalytics() {
        return ResponseEntity.ok(taskService.getTaskAnalytics());
    }
}