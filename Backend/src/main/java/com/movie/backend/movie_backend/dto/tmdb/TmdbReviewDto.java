package com.movie.backend.movie_backend.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TmdbReviewDto {
    private String id;
    private String author;
    private String content;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("author_details")
    private TmdbAuthorDetailsDto authorDetails;
} 