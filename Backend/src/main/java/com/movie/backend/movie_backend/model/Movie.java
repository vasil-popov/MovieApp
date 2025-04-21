package com.movie.backend.movie_backend.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Index;
import jakarta.persistence.Transient;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "movies", 
    indexes = {
        @Index(name = "idx_tmdb_id", columnList = "tmdb_id", unique = true)
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    
    @Id
    private Long id;
    
    private String title;
    
    @Column(name = "release_year")
    private String year;
    
    private String genre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String cover;
    
    @Column(name = "tmdb_id", unique = true)
    private Long tmdbId;
    
    @Column(name = "vote_average")
    private Double voteAverage;
    
    @Column(name = "popularity")
    private Double popularity;
    
    private String backdrop;
    
    private boolean favorite;
    
    @Column(name = "movie_type")
    private String movieType;
    
    @ElementCollection
    @CollectionTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genre_name")
    private List<String> genres;
    
    @Column(name = "release_date")
    private String releaseDate;
    
    @Column(name = "budget")
    private Long budget;
    
    @Column(name = "revenue")
    private Long revenue;
    
    @Column(name = "runtime")
    private Integer runtime;
    
    @Column(name = "trailer_key")
    private String trailerKey;
    
    
    @Transient
    private List<CastMember> cast;
    
    @Transient
    private List<Review> reviews;
} 