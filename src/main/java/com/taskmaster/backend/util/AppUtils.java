package com.taskmaster.backend.util;

import java.time.format.DateTimeFormatter;

public class AppUtils {
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    
    // Static helper methods can go here
    public static String formatUserAction(String username, String action) {
        return String.format("User [%s] performed [%s]", username, action);
    }
}