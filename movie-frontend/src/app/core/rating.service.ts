import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(private http: HttpClient) {}

  rate(movieId: number, rating: number) {
    return this.http.post(`${environment.apiBaseUrl}/api/ratings`, { movieId, rating });
  }

  average(movieId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/api/ratings/${movieId}/average`);
  }
}



