package com.movie.backend.movie_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movie.backend.movie_backend.model.UserToken;
import com.movie.backend.movie_backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    
    @PostMapping("/register-token")
    public ResponseEntity<?> registerToken(@RequestBody UserToken userToken) {
        try {
            if (userToken.getExpoPushToken() == null || userToken.getExpoPushToken().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Expo push token is required");
            }
            
            UserToken savedToken = notificationService.saveUserToken(userToken);
            return ResponseEntity.ok(savedToken);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering token: " + e.getMessage());
        }
    }
} 