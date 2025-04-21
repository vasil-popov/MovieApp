package com.movie.backend.movie_backend.dto.tmdb;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TmdbMovieDto {
    private Long id;
    private String title;
    private String overview;
    
    @JsonProperty("release_date")
    private String releaseDate;
    
    @JsonProperty("poster_path")
    private String posterPath;
    
    @JsonProperty("backdrop_path")
    private String backdropPath;
    
    @JsonProperty("vote_average")
    private Double voteAverage;
    
    private Double popularity;
    
    @JsonProperty("genre_ids")
    private List<Integer> genreIds;
} 