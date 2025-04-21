package com.movie.backend.movie_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    private String id;
    private String author;
    private String content;
    private String createdAt;
    private String avatarPath;
    private Double rating;
} 