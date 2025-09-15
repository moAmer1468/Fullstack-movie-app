import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: '', canActivate: [authGuard], loadComponent: () => import('./features/user/user-dashboard.component').then(m => m.UserDashboardComponent) },
  { path: 'movies/:id', canActivate: [authGuard], loadComponent: () => import('./features/movie/movie-detail.component').then(m => m.MovieDetailComponent) },
  { path: '**', redirectTo: '' }
];
