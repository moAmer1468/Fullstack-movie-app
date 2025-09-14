package com.movieapp.movieapp.repository;

import com.movieapp.movieapp.entity.Movie;
import com.movieapp.movieapp.entity.Rating;
import com.movieapp.movieapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndMovie(User user, Movie movie);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.movie.id = :movieId")
    Double findAverageByMovieId(Long movieId);
}