import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

interface LoginResponse {
  jwt: string;
}

export type UserRole = 'ADMIN' | 'USER' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'jwt_token';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  isAuthenticated = signal<boolean>(this.hasToken());
  role = signal<UserRole>(null);

  constructor(private http: HttpClient) {
    this.refreshRole().subscribe();
  }

  login(username: string, password: string): Observable<UserRole> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { username, password })
      .pipe(
        tap((res) => this.setToken(res.jwt)),
        tap(() => this.isAuthenticated.set(true)),
        switchMap(() => this.refreshRole())
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, { username, password });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticated.set(false);
    this.role.set(null);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  refreshRole(): Observable<UserRole> {
    if (!this.getToken()) {
      this.role.set(null);
      return of(null);
    }
    return this.http.get<{username: string; role: 'ADMIN' | 'USER'}>(`${environment.apiBaseUrl}/auth/me`).pipe(
      map(res => res.role),
      tap(r => this.role.set(r)),
      catchError(() => { this.role.set(null); return of(null); })
    );
  }

  getUserStats(): Observable<{totalUsers: number}> {
    return this.http.get<{totalUsers: number}>(`${environment.apiBaseUrl}/auth/stats`);
  }

  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.isAuthenticated.set(true);
  }
}



