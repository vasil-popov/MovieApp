package com.movie.backend.movie_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CastMember {
    private Long id;
    private String name;
    private String character;
    private String profilePath;
} 