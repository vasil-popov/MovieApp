package com.movie.backend.movie_backend.dto.tmdb;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TmdbMovieDetailsDto {
    private Long id;
    private String title;
    
    @JsonProperty("release_date")
    private String releaseDate;
    
    private String overview;
    
    @JsonProperty("poster_path")
    private String posterPath;
    
    @JsonProperty("backdrop_path")
    private String backdropPath;
    
    @JsonProperty("vote_average")
    private Double voteAverage;
    
    private Double popularity;
    
    private List<TmdbGenreDto> genres;
    
    private Long budget;
    private Long revenue;
    private Integer runtime;
    
    @JsonProperty("videos")
    private TmdbVideosResponseDto videos;
} 