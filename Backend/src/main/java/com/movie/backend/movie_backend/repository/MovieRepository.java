package com.movie.backend.movie_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movie.backend.movie_backend.model.Movie;
import java.util.Optional;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTmdbId(Long tmdbId);
    boolean existsByTmdbId(Long tmdbId);
    List<Movie> findByMovieTypeContaining(String type);
} 