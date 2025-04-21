package com.movie.backend.movie_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.model.UserRating;

public interface UserRatingRepository extends JpaRepository<UserRating, Long> {
    
    Optional<UserRating> findByFbUserIdAndMovie(String fbUserId, Movie movie);
    
    @Query("SELECT AVG(r.rating) FROM UserRating r WHERE r.movie.id = :movieId")
    Double getAverageRatingForMovie(Long movieId);
    
    @Query("SELECT COUNT(r) FROM UserRating r WHERE r.movie.id = :movieId")
    Long getRatingCountForMovie(Long movieId);
} 