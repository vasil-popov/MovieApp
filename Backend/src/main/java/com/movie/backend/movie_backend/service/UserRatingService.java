package com.movie.backend.movie_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.model.UserRating;
import com.movie.backend.movie_backend.repository.MovieRepository;
import com.movie.backend.movie_backend.repository.UserRatingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRatingService {
    
    private final UserRatingRepository userRatingRepository;
    private final MovieRepository movieRepository;
    
    public Integer getUserRatingForMovie(String fbUserId, Long movieId) {
        log.info("Getting rating by user {} for movie {}", fbUserId, movieId);
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + movieId));
        
        return userRatingRepository.findByFbUserIdAndMovie(fbUserId, movie)
                .map(UserRating::getRating)
                .orElse(null);
    }

    @Transactional
    public UserRating rateMovie(String fbUserId, Long movieId, Integer rating) {
        log.info("Rating movie {} by user {} with value {}", movieId, fbUserId, rating);
        
        if (rating < 1 || rating > 10) {
            throw new IllegalArgumentException("Rating must be between 1 and 10");
        }
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + movieId));
        
        UserRating userRating = userRatingRepository.findByFbUserIdAndMovie(fbUserId, movie)
                .orElse(null);
        
        long currentTime = System.currentTimeMillis();
        
        if (userRating == null) {
            userRating = UserRating.builder()
                    .fbUserId(fbUserId)
                    .movie(movie)
                    .rating(rating)
                    .createdAt(currentTime)
                    .updatedAt(currentTime)
                    .build();
        } else {
            userRating.setRating(rating);
            userRating.setUpdatedAt(currentTime);
        }
        
        return userRatingRepository.save(userRating);
    }

    public Double getAverageRatingForMovie(Long movieId) {
        log.info("Getting average rating for movie {}", movieId);
        return userRatingRepository.getAverageRatingForMovie(movieId);
    }

    public Long getRatingCountForMovie(Long movieId) {
        log.info("Getting rating count for movie {}", movieId);
        return userRatingRepository.getRatingCountForMovie(movieId);
    }
} 