package com.movie.backend.movie_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.service.UserFavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class UserFavoriteController {
    
    private final UserFavoriteService userFavoriteService;
    
    @GetMapping
    public ResponseEntity<List<Movie>> getUserFavorites(@RequestParam String fbUserId) {
        return ResponseEntity.ok(userFavoriteService.getUserFavorites(fbUserId));
    }
    
    @PostMapping("/{movieId}/toggle")
    public ResponseEntity<Boolean> toggleFavorite(
            @PathVariable Long movieId,
            @RequestParam String fbUserId) {
        boolean result = userFavoriteService.toggleFavorite(fbUserId, movieId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{movieId}/check")
    public ResponseEntity<Boolean> checkFavorite(
            @PathVariable Long movieId,
            @RequestParam String fbUserId) {
        boolean isFavorite = userFavoriteService.isFavorite(fbUserId, movieId);
        return ResponseEntity.ok(isFavorite);
    }
} 