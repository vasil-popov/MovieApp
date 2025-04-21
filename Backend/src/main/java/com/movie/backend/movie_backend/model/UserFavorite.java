package com.movie.backend.movie_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"fb_user_id", "movie_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFavorite {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "fb_user_id", nullable = false)
    private String fbUserId;
    
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
    
    @Column(name = "created_at", nullable = false)
    private Long createdAt;
} 