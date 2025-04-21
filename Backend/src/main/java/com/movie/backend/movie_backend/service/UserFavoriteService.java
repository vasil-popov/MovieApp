package com.movie.backend.movie_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.model.UserFavorite;
import com.movie.backend.movie_backend.repository.MovieRepository;
import com.movie.backend.movie_backend.repository.UserFavoriteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserFavoriteService {
    
    private final UserFavoriteRepository userFavoriteRepository;
    private final MovieRepository movieRepository;

    public List<Movie> getUserFavorites(String fbUserId) {
        log.info("Getting favorite movies for user: {}", fbUserId);
        return userFavoriteRepository.findByFbUserId(fbUserId)
                .stream()
                .map(UserFavorite::getMovie)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public boolean toggleFavorite(String fbUserId, Long movieId) {
        log.info("Toggling favorite status for user: {} and movie: {}", fbUserId, movieId);
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + movieId));
        
        boolean exists = userFavoriteRepository.existsByFbUserIdAndMovie(fbUserId, movie);
        
        if (exists) {
            userFavoriteRepository.deleteByFbUserIdAndMovie(fbUserId, movie);
            log.info("Removed movie {} from favorites for user {}", movieId, fbUserId);
            return false;
        } else {
            UserFavorite favorite = UserFavorite.builder()
                    .fbUserId(fbUserId)
                    .movie(movie)
                    .createdAt(System.currentTimeMillis())
                    .build();
            
            userFavoriteRepository.save(favorite);
            log.info("Added movie {} to favorites for user {}", movieId, fbUserId);
            return true;
        }
    }

    public boolean isFavorite(String fbUserId, Long movieId) {
        log.info("Checking if movie {} is favorite for user {}", movieId, fbUserId);
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + movieId));
        
        return userFavoriteRepository.existsByFbUserIdAndMovie(fbUserId, movie);
    }
} 