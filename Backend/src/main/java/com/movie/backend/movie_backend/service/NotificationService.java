package com.movie.backend.movie_backend.service;

import org.springframework.stereotype.Service;

import com.movie.backend.movie_backend.model.UserToken;
import com.movie.backend.movie_backend.repository.UserTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final UserTokenRepository userTokenRepository;
    
    public UserToken saveUserToken(UserToken userToken) {
        log.info("Saving user token: {}", userToken);
        
        if (userToken.getExpoPushToken() == null || userToken.getExpoPushToken().trim().isEmpty()) {
            log.error("Expo push token is required");
            throw new IllegalArgumentException("Expo push token is required");
        }

        userTokenRepository.findByExpoPushToken(userToken.getExpoPushToken())
                .ifPresent(existingToken -> {
                    userToken.setId(existingToken.getId());
                    if (existingToken.getCreatedAt() != null) {
                        userToken.setCreatedAt(existingToken.getCreatedAt());
                    }
                });
        
        if (userToken.getDeviceId() != null && !userToken.getDeviceId().trim().isEmpty()) {
            userTokenRepository.findByDeviceId(userToken.getDeviceId())
                    .ifPresent(existingToken -> {
                        if (userToken.getId() == null) {
                            userToken.setId(existingToken.getId());
                            if (existingToken.getCreatedAt() != null) {
                                userToken.setCreatedAt(existingToken.getCreatedAt());
                            }
                        }
                    });
        }
        
        if (userToken.getCreatedAt() == null) {
            userToken.setCreatedAt(System.currentTimeMillis());
        }
        
        log.info("Saving user token with ID: {}, fbUserId: {}, deviceId: {}, expoPushToken: {}", 
                userToken.getId(), userToken.getFbUserId(), userToken.getDeviceId(), userToken.getExpoPushToken());
        
        return userTokenRepository.save(userToken);
    }
} 