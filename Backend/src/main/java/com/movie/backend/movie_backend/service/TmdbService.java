package com.movie.backend.movie_backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.movie.backend.movie_backend.config.TmdbApiConfig;
import com.movie.backend.movie_backend.dto.tmdb.TmdbGenreDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbGenreListResponseDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbMovieDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbMovieListResponseDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbMovieDetailsDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbCreditsResponseDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbReviewsResponseDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbVideoDto;
import com.movie.backend.movie_backend.dto.tmdb.TmdbVideosResponseDto;
import com.movie.backend.movie_backend.model.Movie;
import com.movie.backend.movie_backend.model.CastMember;
import com.movie.backend.movie_backend.model.Review;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TmdbService {

    private final WebClient tmdbWebClient;
    private final TmdbApiConfig tmdbApiConfig;
    
    @Cacheable(value = "genres")
    public Map<Integer, String> getGenres() {
        log.info("Fetching genres from TMDB API");
        
        Map<Integer, String> genreMap = new HashMap<>();
        
        TmdbGenreListResponseDto response = tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/genre/movie/list")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .build())
                .retrieve()
                .bodyToMono(TmdbGenreListResponseDto.class)
                .block();
        
        if (response != null && response.getGenres() != null) {
            for (TmdbGenreDto genre : response.getGenres()) {
                genreMap.put(genre.getId(), genre.getName());
            }
        }
        
        return genreMap;
    }
    
    public TmdbMovieListResponseDto getPopularMovies(int page) {
        log.info("Fetching popular movies from TMDB API, page: {}", page);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/popular")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieListResponseDto.class)
                .block();
    }
    
    public TmdbMovieListResponseDto getNowPlayingMovies(int page) {
        log.info("Fetching now playing movies from TMDB API, page: {}", page);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/now_playing")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieListResponseDto.class)
                .block();
    }
    
    public TmdbMovieListResponseDto getTopRatedMovies(int page) {
        log.info("Fetching top rated movies from TMDB API, page: {}", page);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/top_rated")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieListResponseDto.class)
                .block();
    }
    
    public TmdbMovieListResponseDto getUpcomingMovies(int page) {
        log.info("Fetching upcoming movies from TMDB API, page: {}", page);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/upcoming")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieListResponseDto.class)
                .block();
    }
    
    public TmdbMovieDto getMovieDetails(Long movieId) {
        log.info("Fetching basic movie details from TMDB API for movie ID: {}", movieId);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId)
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieDto.class)
                .block();
    }
    
    public TmdbMovieDetailsDto getEnhancedMovieDetails(Long movieId) {
        log.info("Fetching enhanced movie details from TMDB API for movie ID: {}", movieId);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId)
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieDetailsDto.class)
                .block();
    }
    
    public TmdbVideosResponseDto getMovieVideos(Long movieId) {
        log.info("Fetching movie videos/trailers from TMDB API for movie ID: {}", movieId);
        
        TmdbVideosResponseDto bgVideos = tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId + "/videos")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .build())
                .retrieve()
                .bodyToMono(TmdbVideosResponseDto.class)
                .block();
        
        if (bgVideos == null || bgVideos.getResults() == null || bgVideos.getResults().isEmpty()) {
            log.info("No Bulgarian videos found, fetching English videos for movie ID: {}", movieId);
            return tmdbWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/movie/" + movieId + "/videos")
                            .queryParam("api_key", tmdbApiConfig.getApiKey())
                            .queryParam("language", "en-US")
                            .build())
                    .retrieve()
                    .bodyToMono(TmdbVideosResponseDto.class)
                    .block();
        }
        
        return bgVideos;
    }
    
    public TmdbCreditsResponseDto getMovieCredits(Long movieId) {
        log.info("Fetching movie credits from TMDB API for movie ID: {}", movieId);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId + "/credits")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .build())
                .retrieve()
                .bodyToMono(TmdbCreditsResponseDto.class)
                .block();
    }
    
    public TmdbReviewsResponseDto getMovieReviews(Long movieId) {
        log.info("Fetching movie reviews from TMDB API for movie ID: {}", movieId);
        
        TmdbReviewsResponseDto bgReviews = tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId + "/reviews")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .build())
                .retrieve()
                .bodyToMono(TmdbReviewsResponseDto.class)
                .block();
        
        if (bgReviews == null || bgReviews.getResults() == null || bgReviews.getResults().isEmpty()) {
            log.info("No Bulgarian reviews found, fetching English reviews for movie ID: {}", movieId);
            return tmdbWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/movie/" + movieId + "/reviews")
                            .queryParam("api_key", tmdbApiConfig.getApiKey())
                            .queryParam("language", "en-US")
                            .build())
                    .retrieve()
                    .bodyToMono(TmdbReviewsResponseDto.class)
                    .block();
        }
        
        return bgReviews;
    }
    
    public TmdbMovieListResponseDto searchMovies(String query, int page) {
        log.info("Searching movies with query: '{}', page: {}", query, page);
        
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("api_key", tmdbApiConfig.getApiKey())
                        .queryParam("language", "bg")
                        .queryParam("query", query)
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieListResponseDto.class)
                .block();
    }
    
    public Movie convertToMovie(TmdbMovieDto tmdbMovie, Map<Integer, String> genreMap) {
        String genres = "";
        
        if (tmdbMovie.getGenreIds() != null && !tmdbMovie.getGenreIds().isEmpty()) {
            genres = tmdbMovie.getGenreIds().stream()
                    .map(genreMap::get)
                    .filter(genre -> genre != null)
                    .collect(Collectors.joining(", "));
        }
        
        String year = "";
        if (tmdbMovie.getReleaseDate() != null && tmdbMovie.getReleaseDate().length() >= 4) {
            year = tmdbMovie.getReleaseDate().substring(0, 4);
        }
        
        String posterUrl = tmdbMovie.getPosterPath() != null
                ? tmdbApiConfig.getImageBaseUrl() + tmdbMovie.getPosterPath()
                : null;
        
        String backdropUrl = tmdbMovie.getBackdropPath() != null
                ? tmdbApiConfig.getImageBaseUrl() + tmdbMovie.getBackdropPath()
                : null;
        
        return Movie.builder()
                .id(tmdbMovie.getId())
                .tmdbId(tmdbMovie.getId())
                .title(tmdbMovie.getTitle())
                .description(tmdbMovie.getOverview())
                .year(year)
                .genre(genres)
                .cover(posterUrl)
                .backdrop(backdropUrl)
                .voteAverage(tmdbMovie.getVoteAverage())
                .popularity(tmdbMovie.getPopularity())
                .favorite(false)
                .build();
    }
    
    public Movie convertEnhancedMovieDetails(TmdbMovieDetailsDto detailsDto, 
                                            TmdbCreditsResponseDto creditsDto, 
                                            TmdbReviewsResponseDto reviewsDto) {
        String year = "";
        if (detailsDto.getReleaseDate() != null && detailsDto.getReleaseDate().length() >= 4) {
            year = detailsDto.getReleaseDate().substring(0, 4);
        }
        
        String posterUrl = detailsDto.getPosterPath() != null
                ? tmdbApiConfig.getImageBaseUrl() + detailsDto.getPosterPath()
                : null;
        
        String backdropUrl = detailsDto.getBackdropPath() != null
                ? tmdbApiConfig.getImageBaseUrl() + detailsDto.getBackdropPath()
                : null;
        
        List<String> genreList = new ArrayList<>();
        String genreString = "";
        
        if (detailsDto.getGenres() != null && !detailsDto.getGenres().isEmpty()) {
            genreList = detailsDto.getGenres().stream()
                    .map(TmdbGenreDto::getName)
                    .collect(Collectors.toList());
            
            genreString = String.join(", ", genreList);
        }
        
        String trailerKey = null;
        TmdbVideosResponseDto videosResponse = getMovieVideos(detailsDto.getId());
        
        if (videosResponse != null && videosResponse.getResults() != null) {
            TmdbVideoDto trailer = videosResponse.getResults().stream()
                    .filter(video -> "Trailer".equals(video.getType()) && "YouTube".equals(video.getSite()))
                    .findFirst()
                    .orElse(null);
            
            if (trailer != null) {
                trailerKey = trailer.getKey();
            }
        }
        
        List<CastMember> cast = new ArrayList<>();
        if (creditsDto != null && creditsDto.getCast() != null) {
            cast = creditsDto.getCast().stream()
                    .limit(10)  
                    .map(castDto -> {
                        String profileImageUrl = castDto.getProfilePath() != null
                                ? tmdbApiConfig.getImageBaseUrl() + castDto.getProfilePath()
                                : null;
                        
                        return CastMember.builder()
                                .id(castDto.getId())
                                .name(castDto.getName())
                                .character(castDto.getCharacter())
                                .profilePath(profileImageUrl)
                                .build();
                    })
                    .collect(Collectors.toList());
        }
        
        List<Review> reviews = new ArrayList<>();
        if (reviewsDto != null && reviewsDto.getResults() != null) {
            reviews = reviewsDto.getResults().stream()
                    .map(reviewDto -> {
                        String avatarPath = null;
                        Double rating = null;
                        
                        if (reviewDto.getAuthorDetails() != null) {
                            if (reviewDto.getAuthorDetails().getAvatarPath() != null) {
                                String path = reviewDto.getAuthorDetails().getAvatarPath();
                                if (path.startsWith("/")) {
                                    avatarPath = tmdbApiConfig.getImageBaseUrl() + path;
                                } else {
                                    avatarPath = path;
                                }
                            }
                            rating = reviewDto.getAuthorDetails().getRating();
                        }
                        
                        return Review.builder()
                                .id(reviewDto.getId())
                                .author(reviewDto.getAuthor())
                                .content(reviewDto.getContent())
                                .createdAt(reviewDto.getCreatedAt())
                                .avatarPath(avatarPath)
                                .rating(rating)
                                .build();
                    })
                    .collect(Collectors.toList());
        }
        
        return Movie.builder()
                .id(detailsDto.getId())
                .tmdbId(detailsDto.getId())
                .title(detailsDto.getTitle())
                .description(detailsDto.getOverview())
                .year(year)
                .genre(genreString)
                .genres(genreList)
                .cover(posterUrl)
                .backdrop(backdropUrl)
                .voteAverage(detailsDto.getVoteAverage())
                .popularity(detailsDto.getPopularity())
                .favorite(false)
                .budget(detailsDto.getBudget())
                .revenue(detailsDto.getRevenue())
                .runtime(detailsDto.getRuntime())
                .releaseDate(detailsDto.getReleaseDate())
                .trailerKey(trailerKey)
                .cast(cast)
                .reviews(reviews)
                .build();
    }
} 