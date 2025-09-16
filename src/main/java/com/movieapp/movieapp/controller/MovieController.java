package com.movieapp.movieapp.controller;

import com.movieapp.movieapp.entity.Movie;
import com.movieapp.movieapp.service.MovieService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<Page<Movie>> getAllMovies(Pageable pageable) {
        return ResponseEntity.ok(movieService.getAllMovies(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        Optional<Movie> movie = movieService.getMovieById(id);
        return movie.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchDb(@RequestParam String query) {
        return ResponseEntity.ok(movieService.searchDb(query));
    }

    @GetMapping("/search-omdb")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Movie>> searchOmdb(@RequestParam String query) {
        return ResponseEntity.ok(movieService.searchOmdb(query));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(movieService.addMovie(movie));
    }

    @PostMapping("/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Movie>> addBatch(@RequestBody List<Movie> movies) {
        return ResponseEntity.ok(movieService.addBatch(movies));
    }

    // ✅ New fetch endpoint
    @PostMapping("/fetch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Movie>> fetchAndSaveMovies(@RequestParam String query) {
        List<Movie> movies = movieService.fetchAndSaveFromOmdb(query);
        return ResponseEntity.ok(movies);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        Optional<Movie> movie = movieService.updateMovie(id, updatedMovie);
        return movie.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        boolean deleted = movieService.deleteMovie(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/delete-batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBatch(@RequestBody List<Long> ids) {
        movieService.deleteBatch(ids);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(movieService.getStats());
    }
}
