package com.movie.backend.movie_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.model.UserFavorite;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    
    List<UserFavorite> findByFbUserId(String fbUserId);
    
    Optional<UserFavorite> findByFbUserIdAndMovie(String fbUserId, Movie movie);
    
    void deleteByFbUserIdAndMovie(String fbUserId, Movie movie);
    
    boolean existsByFbUserIdAndMovie(String fbUserId, Movie movie);
} 