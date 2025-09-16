import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { Movie } from './movie.service';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private http: HttpClient) {}

  // Get recommended movies for the current user
  getRecommendations(): Observable<Movie[]> {
    // This is a mock implementation since there's no backend endpoint yet
    return new Observable<Movie[]>(observer => {
      setTimeout(() => {
        observer.next([
          {
            id: 1,
            title: 'Inception',
            year: '2010',
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
            plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            genre: 'Action, Adventure, Sci-Fi',
            director: 'Christopher Nolan'
          },
          {
            id: 2,
            title: 'The Matrix',
            year: '1999',
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
            plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
            genre: 'Action, Sci-Fi',
            director: 'Lana Wachowski, Lilly Wachowski'
          },
          {
            id: 3,
            title: 'Interstellar',
            year: '2014',
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
            plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            genre: 'Adventure, Drama, Sci-Fi',
            director: 'Christopher Nolan'
          }
        ]);
        observer.complete();
      }, 500);
    });
  }

  // Get genre preferences for the current user
  getUserPreferences(): Observable<string[]> {
    // This is a mock implementation since there's no backend endpoint yet
    return of(['Sci-Fi', 'Action', 'Drama']);
  }

  // Update user preferences
  updatePreferences(genres: string[]): Observable<string[]> {
    // This is a mock implementation since there's no backend endpoint yet
    return of(genres);
  }
}