package com.movieapp.movieapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // ✅ تغيير الاسم من year -> release_year في الـ DB
    @Column(name = "release_year")
    private String year;

    @Column(unique = true, nullable = false)
    private String imdbId;

    private String type;

    private String posterUrl;
    
    private String genre;
    
    private String director;
    
    private String actors;
    
    private String plot;
}
