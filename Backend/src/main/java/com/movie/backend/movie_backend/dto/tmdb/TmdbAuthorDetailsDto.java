package com.movie.backend.movie_backend.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TmdbAuthorDetailsDto {
    @JsonProperty("avatar_path")
    private String avatarPath;
    
    private Double rating;
} 