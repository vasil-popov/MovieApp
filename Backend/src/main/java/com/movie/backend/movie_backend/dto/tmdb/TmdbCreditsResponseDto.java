package com.movie.backend.movie_backend.dto.tmdb;

import java.util.List;

import lombok.Data;

@Data
public class TmdbCreditsResponseDto {
    private List<TmdbCastDto> cast;
} 