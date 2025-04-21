package com.movie.backend.movie_backend.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TmdbCastDto {
    private Long id;
    private String name;
    private String character;
    
    @JsonProperty("profile_path")
    private String profilePath;
} 