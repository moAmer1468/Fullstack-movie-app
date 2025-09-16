import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <nav class="navbar" *ngIf="auth.isAuthenticated()">
      <div class="navbar-brand">
        <h1>MovieApp</h1>
      </div>
      <div class="navbar-links" *ngIf="auth.role() === 'USER'">
        <a routerLink="/user/movies" routerLinkActive="active">Movies</a>
        <a routerLink="/user/dashboard" routerLinkActive="active">Dashboard</a>
      </div>
      <div class="navbar-links" *ngIf="auth.role() === 'ADMIN'">
        <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/admin/manage-movies" routerLinkActive="active">Manage Movies</a>
      </div>
      <div class="navbar-actions">
        <button class="logout-btn" (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styleUrls: ['../app.css']
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
}


