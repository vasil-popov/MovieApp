package com.movie.backend.movie_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.movie.backend.movie_backend.model.UserRating;
import com.movie.backend.movie_backend.service.UserRatingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class UserRatingController {
    
    private final UserRatingService userRatingService;
    
    @GetMapping("/{movieId}")
    public ResponseEntity<Integer> getUserRatingForMovie(
            @PathVariable Long movieId,
            @RequestParam String fbUserId) {
        Integer rating = userRatingService.getUserRatingForMovie(fbUserId, movieId);
        if (rating == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(rating);
    }
    
    @PostMapping("/{movieId}")
    public ResponseEntity<?> rateMovie(
            @PathVariable Long movieId,
            @RequestParam String fbUserId,
            @RequestParam Integer rating) {
        try {
            UserRating userRating = userRatingService.rateMovie(fbUserId, movieId, rating);
            return ResponseEntity.ok(userRating);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rating movie: " + e.getMessage());
        }
    }
    

    @GetMapping("/{movieId}/average")
    public ResponseEntity<Double> getAverageRatingForMovie(@PathVariable Long movieId) {
        Double avgRating = userRatingService.getAverageRatingForMovie(movieId);
        if (avgRating == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(avgRating);
    }
    

    @GetMapping("/{movieId}/count")
    public ResponseEntity<Long> getRatingCountForMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(userRatingService.getRatingCountForMovie(movieId));
    }
} 