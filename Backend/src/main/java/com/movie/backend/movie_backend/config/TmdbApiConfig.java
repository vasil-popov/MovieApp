package com.movie.backend.movie_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class TmdbApiConfig {

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    @Value("${tmdb.api.image-base-url}")
    private String imageBaseUrl;

    @Bean
    public WebClient tmdbWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getImageBaseUrl() {
        return imageBaseUrl;
    }
} 