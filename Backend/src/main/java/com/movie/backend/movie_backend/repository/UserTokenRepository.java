package com.movie.backend.movie_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movie.backend.movie_backend.model.UserToken;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByExpoPushToken(String expoPushToken);
    Optional<UserToken> findByDeviceId(String deviceId);
} 