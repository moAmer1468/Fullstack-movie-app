import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Movie {
  id?: number;
  title: string;
  year?: string;
  imdbId?: string;
  posterUrl?: string;
  plot?: string;
  type?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<Page<Movie>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Movie>>(`${environment.apiBaseUrl}/api/movies`, { params });
  }

  getById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${environment.apiBaseUrl}/api/movies/${id}`);
  }

  searchDb(query: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiBaseUrl}/api/movies/search`, {
      params: { query }
    });
  }

  searchOmdb(query: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiBaseUrl}/api/movies/search-omdb`, {
      params: { query }
    });
  }

  add(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${environment.apiBaseUrl}/api/movies`, movie);
  }

  addBatch(movies: Movie[]): Observable<Movie[]> {
    return this.http.post<Movie[]>(`${environment.apiBaseUrl}/api/movies/batch`, movies);
  }

  fetchAndSave(query: string): Observable<Movie[]> {
    return this.http.post<Movie[]>(`${environment.apiBaseUrl}/api/movies/fetch`, null, {
      params: { query }
    });
  }

  update(id: number, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${environment.apiBaseUrl}/api/movies/${id}`, movie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/movies/${id}`);
  }

  deleteBatch(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/movies/delete-batch`, ids);
  }
}



