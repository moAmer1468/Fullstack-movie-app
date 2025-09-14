package com.movieapp.movieapp.service;

import com.movieapp.movieapp.entity.Movie;
import com.movieapp.movieapp.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate;

    @Value("${omdb.api.url}")
    private String omdbUrl;

    @Value("${omdb.api.key}")
    private String omdbKey;

    public MovieService(MovieRepository movieRepository, RestTemplate restTemplate) {
        this.movieRepository = movieRepository;
        this.restTemplate = restTemplate;
    }

    public Page<Movie> getAllMovies(Pageable pageable) {
        return movieRepository.findAll(pageable);
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public Movie addMovie(Movie movie) {
        if (movieRepository.existsByImdbId(movie.getImdbId())) {
            throw new RuntimeException("Movie with IMDb ID " + movie.getImdbId() + " already exists");
        }
        return movieRepository.save(movie);
    }

    public List<Movie> addBatch(List<Movie> movies) {
        List<Movie> added = new ArrayList<>();
        for (Movie movie : movies) {
            if (!movieRepository.existsByImdbId(movie.getImdbId())) {
                added.add(movieRepository.save(movie));
            }
        }
        return added;
    }

    public Optional<Movie> updateMovie(Long id, Movie updatedMovie) {
        return movieRepository.findById(id).map(existing -> {
            existing.setTitle(updatedMovie.getTitle());
            existing.setYear(updatedMovie.getYear());
            existing.setImdbId(updatedMovie.getImdbId());
            existing.setType(updatedMovie.getType());
            existing.setPosterUrl(updatedMovie.getPosterUrl());
            return movieRepository.save(existing);
        });
    }

    public boolean deleteMovie(Long id) {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void deleteBatch(List<Long> ids) {
        movieRepository.deleteAllById(ids);
    }

    public List<Movie> searchDb(String query) {
        return movieRepository.findByTitleContainingIgnoreCase(query);
    }

    public List<Movie> searchOmdb(String query) {
        try {
            String apiUrl = omdbUrl + "?s=" + URLEncoder.encode(query, StandardCharsets.UTF_8) + "&apikey=" + omdbKey;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);
            if (response == null || "False".equals(response.get("Response"))) {
                throw new RuntimeException((String) response.getOrDefault("Error", "OMDB search failed"));
            }
            @SuppressWarnings("unchecked")
            List<Map<String, String>> searchResults = (List<Map<String, String>>) response.get("Search");
            return searchResults.stream()
                    .map(result -> Movie.builder()
                            .title(result.get("Title"))
                            .year(result.get("Year"))
                            .imdbId(result.get("imdbID"))
                            .type(result.get("Type"))
                            .posterUrl(result.get("Poster"))
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("OMDB API error: " + e.getMessage());
        }
    }

    // ✅ New Method: fetch and save movies from OMDB
    public List<Movie> fetchAndSaveFromOmdb(String query) {
        List<Movie> fetchedMovies = searchOmdb(query); // use existing OMDB search
        List<Movie> savedMovies = new ArrayList<>();

        for (Movie movie : fetchedMovies) {
            if (!movieRepository.existsByImdbId(movie.getImdbId())) {
                savedMovies.add(movieRepository.save(movie));
            }
        }

        return savedMovies;
    }
}
