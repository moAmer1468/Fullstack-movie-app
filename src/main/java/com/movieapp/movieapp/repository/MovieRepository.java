package com.movieapp.movieapp.repository;

import com.movieapp.movieapp.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    boolean existsByImdbId(String imdbId);
    List<Movie> findByTitleContainingIgnoreCase(String title);
}