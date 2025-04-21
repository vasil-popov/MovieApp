package com.movie.backend.movie_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.service.MovieService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;
    
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getEnhancedMovieDetails(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam String query) {
        return ResponseEntity.ok(movieService.searchMovies(query));
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<Movie>> getPopularMovies(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(movieService.getPopularMoviesFromTmdb(page));
    }
    
    @GetMapping("/now-playing")
    public ResponseEntity<List<Movie>> getNowPlayingMovies(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(movieService.getNowPlayingMoviesFromTmdb(page));
    }
    
    @GetMapping("/top-rated")
    public ResponseEntity<List<Movie>> getTopRatedMovies(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(movieService.getTopRatedMoviesFromTmdb(page));
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Movie>> getUpcomingMovies(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(movieService.getUpcomingMoviesFromTmdb(page));
    }
    
    @GetMapping("/{id}/videos")
    public ResponseEntity<Object> getMovieVideos(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieVideos(id));
    }
} 