import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Review {
  id?: number;
  movieId: number;
  userId?: number;
  username?: string;
  content: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  // Get all reviews for a movie
  getMovieReviews(movieId: number): Observable<Review[]> {
    // This is a mock implementation since there's no backend endpoint yet
    // In a real implementation, this would call a backend API
    return new Observable<Review[]>(observer => {
      // Simulate network delay
      setTimeout(() => {
        // Return mock data
        observer.next([
          {
            id: 1,
            movieId: movieId,
            username: 'user1',
            content: 'Great movie! Loved the plot and characters.',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            movieId: movieId,
            username: 'user2',
            content: 'Interesting concept but the execution could be better.',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ]);
        observer.complete();
      }, 500);
    });
  }

  // Add a review for a movie
  addReview(review: Review): Observable<Review> {
    // This is a mock implementation since there's no backend endpoint yet
    return new Observable<Review>(observer => {
      setTimeout(() => {
        const newReview = {
          ...review,
          id: Math.floor(Math.random() * 1000) + 3, // Generate random ID
          username: 'currentUser', // In real implementation, this would come from the backend
          createdAt: new Date().toISOString()
        };
        observer.next(newReview);
        observer.complete();
      }, 500);
    });
  }
}