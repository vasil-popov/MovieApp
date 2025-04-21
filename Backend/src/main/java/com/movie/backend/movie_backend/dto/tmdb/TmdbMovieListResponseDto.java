package com.movie.backend.movie_backend.dto.tmdb;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TmdbMovieListResponseDto {
    private int page;
    
    @JsonProperty("total_results")
    private int totalResults;
    
    @JsonProperty("total_pages")
    private int totalPages;
    
    private List<TmdbMovieDto> results;
} 