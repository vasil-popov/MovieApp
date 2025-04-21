package com.movie.backend.movie_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movie.backend.movie_backend.dto.tmdb.TmdbMovieDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbMovieListResponseDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbMovieDetailsDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbCreditsResponseDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbReviewsResponseDto;
import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.repository.MovieRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieService {

    private final MovieRepository movieRepository;
    private final TmdbService tmdbService;
    
    @Cacheable(value = "movies")
    public List<Movie> getAllMovies() {
        log.info("Fetching all movies from database");
        List<Movie> movies = movieRepository.findAll();
        
        if (movies.isEmpty()) {
            log.info("No movies found in database, fetching from TMDB API");
            return getPopularMoviesFromTmdb(1);
        }
        
        return movies;
    }
    
    @Transactional
    public List<Movie> getPopularMoviesFromTmdb(int page) {
        log.info("Fetching popular movies from TMDB API, page: {}", page);
        return getMoviesFromTmdb("popular", page);
    }
    
    @Transactional
    public List<Movie> getNowPlayingMoviesFromTmdb(int page) {
        log.info("Fetching now playing movies from TMDB API, page: {}", page);
        return getMoviesFromTmdb("now_playing", page);
    }
    
    @Transactional
    public List<Movie> getTopRatedMoviesFromTmdb(int page) {
        log.info("Fetching top rated movies from TMDB API, page: {}", page);
        return getMoviesFromTmdb("top_rated", page);
    }
    
    @Transactional
    public List<Movie> getUpcomingMoviesFromTmdb(int page) {
        log.info("Fetching upcoming movies from TMDB API, page: {}", page);
        return getMoviesFromTmdb("upcoming", page);
    }
    
    private List<Movie> getMoviesFromTmdb(String type, int page) {
        List<Movie> movies = new ArrayList<>();
        
        Map<Integer, String> genreMap = tmdbService.getGenres();
        TmdbMovieListResponseDto response = null;
        
        switch(type) {
            case "now_playing":
                response = tmdbService.getNowPlayingMovies(page);
                break;
            case "popular":
                response = tmdbService.getPopularMovies(page);
                break;
            case "top_rated":
                response = tmdbService.getTopRatedMovies(page);
                break;
            case "upcoming":
                response = tmdbService.getUpcomingMovies(page);
                break;
            default:
                response = tmdbService.getPopularMovies(page);
                break;
        }
        
        if (response != null && response.getResults() != null) {
            for (TmdbMovieDto tmdbMovie : response.getResults()) {
                Movie movie = tmdbService.convertToMovie(tmdbMovie, genreMap);
                movie.setMovieType(type);
                
                try {
                    Optional<Movie> existingMovie = movieRepository.findByTmdbId(movie.getTmdbId());
                    if (existingMovie.isPresent()) {
                        Movie existing = existingMovie.get();
                        if (existing.getMovieType() == null || !existing.getMovieType().contains(type)) {
                            if (existing.getMovieType() == null) {
                                existing.setMovieType(type);
                            } else {
                                existing.setMovieType(existing.getMovieType() + "," + type);
                            }
                            movieRepository.save(existing);
                        }
                        movies.add(existing);
                    } else {
                        Movie savedMovie = movieRepository.save(movie);
                        movies.add(savedMovie);
                    }
                } catch (DataIntegrityViolationException e) {
                    log.warn("Duplicate movie detected for TMDB ID: {}", movie.getTmdbId());
                    Movie existing = movieRepository.findByTmdbId(movie.getTmdbId()).orElse(movie);
                    movies.add(existing);
                }
            }
        }
        
        return movies;
    }
    
    public Movie getMovieById(Long id) {
        log.info("Fetching movie by ID: {}", id);
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
    }
    
    @Transactional
    public Movie getMovieByTmdbId(Long tmdbId) {
        log.info("Fetching movie by TMDB ID: {}", tmdbId);
        Optional<Movie> existingMovie = movieRepository.findByTmdbId(tmdbId);
        
        if (existingMovie.isPresent()) {
            return existingMovie.get();
        }
        
        TmdbMovieDto tmdbMovie = tmdbService.getMovieDetails(tmdbId);
        if (tmdbMovie == null) {
            throw new RuntimeException("Movie not found with TMDB ID: " + tmdbId);
        }
        
        Map<Integer, String> genreMap = tmdbService.getGenres();
        Movie movie = tmdbService.convertToMovie(tmdbMovie, genreMap);
        movie.setMovieType("details"); 
        
        try {
            return movieRepository.save(movie);
        } catch (DataIntegrityViolationException e) {
            log.warn("Duplicate movie detected when saving details for TMDB ID: {}", tmdbId);
            return movieRepository.findByTmdbId(tmdbId).orElse(movie);
        }
    }
    
    public List<Movie> searchMovies(String query) {
        log.info("Searching movies with query: '{}'", query);
        List<Movie> movies = new ArrayList<>();
        
        Map<Integer, String> genreMap = tmdbService.getGenres();
        TmdbMovieListResponseDto response = tmdbService.searchMovies(query, 1);
        
        if (response != null && response.getResults() != null) {
            for (TmdbMovieDto tmdbMovie : response.getResults()) {
                Movie movie = tmdbService.convertToMovie(tmdbMovie, genreMap);
                movie.setMovieType("search");
                
                try {
                    Optional<Movie> existingMovie = movieRepository.findByTmdbId(movie.getTmdbId());
                    if (existingMovie.isPresent()) {
                        movies.add(existingMovie.get());
                    } else {
                        Movie savedMovie = movieRepository.save(movie);
                        movies.add(savedMovie);
                    }
                } catch (DataIntegrityViolationException e) {
                    log.warn("Duplicate movie detected during search for TMDB ID: {}", movie.getTmdbId());
                    Movie existing = movieRepository.findByTmdbId(movie.getTmdbId()).orElse(movie);
                    movies.add(existing);
                }
            }
        }
        
        return movies;
    }
    
    @Transactional
    public Movie toggleFavorite(Long id) {
        log.info("Toggling favorite status for movie with ID: {}", id);
        Movie movie = getMovieById(id);
        movie.setFavorite(!movie.isFavorite());
        return movieRepository.save(movie);
    }
    
    @CacheEvict(value = "movies", allEntries = true)
    public void refreshMovieCache() {
        log.info("Refreshing movie cache");
    }
    
    public List<Movie> getMoviesByType(String type) {
        log.info("Fetching movies by type: {}", type);
        return movieRepository.findByMovieTypeContaining(type);
    }
    
    public Object getMovieVideos(Long id) {
        log.info("Fetching videos for movie with ID: {}", id);
        Movie movie = getMovieById(id);
        return tmdbService.getMovieVideos(movie.getTmdbId());
    }
    
    @Transactional
    public Movie getEnhancedMovieDetails(Long id) {
        log.info("Fetching enhanced movie details with ID: {}", id);
        
        Movie movie = getMovieById(id);
        
        try {
            TmdbMovieDetailsDto detailsDto = tmdbService.getEnhancedMovieDetails(movie.getTmdbId());
            TmdbCreditsResponseDto creditsDto = tmdbService.getMovieCredits(movie.getTmdbId());
            TmdbReviewsResponseDto reviewsDto = tmdbService.getMovieReviews(movie.getTmdbId());
            
            Movie enhancedMovie = tmdbService.convertEnhancedMovieDetails(detailsDto, creditsDto, reviewsDto);
            
            enhancedMovie.setId(movie.getId());
            enhancedMovie.setFavorite(movie.isFavorite());
            
            movie.setGenre(enhancedMovie.getGenre());
            movie.setGenres(enhancedMovie.getGenres());
            movie.setBudget(enhancedMovie.getBudget());
            movie.setRevenue(enhancedMovie.getRevenue());
            movie.setRuntime(enhancedMovie.getRuntime());
            movie.setReleaseDate(enhancedMovie.getReleaseDate());
            movie.setTrailerKey(enhancedMovie.getTrailerKey());
            
            movie = movieRepository.save(movie);
            
            movie.setCast(enhancedMovie.getCast());
            movie.setReviews(enhancedMovie.getReviews());
            
            return movie;
        } catch (Exception e) {
            log.error("Error fetching enhanced movie details from TMDB: {}", e.getMessage());
            return movie;
        }
    }
} 