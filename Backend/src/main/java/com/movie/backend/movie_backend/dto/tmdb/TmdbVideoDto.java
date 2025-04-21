package com.movie.backend.movie_backend.dto.tmdb;

import lombok.Data;

@Data
public class TmdbVideoDto {
    private String id;
    private String key;
    private String name;
    private String site;
    private String type;
} 