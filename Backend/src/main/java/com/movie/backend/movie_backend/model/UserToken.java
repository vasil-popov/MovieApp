package com.movie.backend.movie_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "user_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "fb_user_id")
    private String fbUserId;
    
    @NotBlank(message = "Expo push token is required")
    @Column(name = "expo_push_token", unique = true, nullable = false)
    private String expoPushToken;
    
    @Column(name = "device_id")
    private String deviceId;
    
    @Column(name = "created_at", nullable = false)
    private Long createdAt;
} 