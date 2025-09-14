package com.movieapp.movieapp.controller;

import com.movieapp.movieapp.entity.Rating;
import com.movieapp.movieapp.service.RatingService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> rateMovie(@RequestBody RatingRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Rating rating = ratingService.addOrUpdateRating(username, request.getMovieId(), request.getRating());
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/{movieId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long movieId) {
        return ResponseEntity.ok(ratingService.getAverageRating(movieId));
    }

    @Data
    public static class RatingRequest {
        private Long movieId;
        private int rating;
    }
}