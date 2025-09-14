package com.movieapp.movieapp.service;

import com.movieapp.movieapp.entity.Movie;
import com.movieapp.movieapp.entity.Rating;
import com.movieapp.movieapp.entity.User;
import com.movieapp.movieapp.repository.RatingRepository;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserService userService;
    private final MovieService movieService;

    public RatingService(RatingRepository ratingRepository, UserService userService, MovieService movieService) {
        this.ratingRepository = ratingRepository;
        this.userService = userService;
        this.movieService = movieService;
    }

    public Rating addOrUpdateRating(String username, Long movieId, int rating) {
        if (rating < 1 || rating > 10) {
            throw new IllegalArgumentException("Rating must be between 1 and 10");
        }
        User user = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieService.getMovieById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Rating existing = ratingRepository.findByUserAndMovie(user, movie)
                .orElse(Rating.builder().user(user).movie(movie).build());
        existing.setRating(rating);
        return ratingRepository.save(existing);
    }

    public double getAverageRating(Long movieId) {
        Double avg = ratingRepository.findAverageByMovieId(movieId);
        return avg != null ? avg : 0.0;
    }
}