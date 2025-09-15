import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf],
  template: `
  <nav style="display:flex;gap:12px;align-items:center;padding:12px;border-bottom:1px solid #eee">
    <a routerLink="/" routerLinkActive="active">User</a>
    <a routerLink="/admin" routerLinkActive="active">Admin</a>
    <a *ngIf="!auth.isAuthenticated()" routerLink="/login" routerLinkActive="active">Login</a>
    <button *ngIf="auth.isAuthenticated()" (click)="logout()">Logout</button>
  </nav>
  <router-outlet />
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('movie-frontend');
  readonly auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
