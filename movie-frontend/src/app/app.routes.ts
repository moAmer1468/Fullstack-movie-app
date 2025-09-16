import { Routes, CanActivateFn, Router } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './core/auth.service';

const redirectIfAuthedGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return true;
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return inject(Router).createUrlTree(['/user/dashboard']);
  return true;
};

export const routes: Routes = [
  { path: 'login', canActivate: [redirectIfAuthedGuard], loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [redirectIfAuthedGuard], loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  
  { path: 'user/dashboard', canActivate: [authGuard], loadComponent: () => import('./features/user/user-dashboard.component').then(m => m.UserDashboardComponent) },
  { path: 'user/movies', canActivate: [authGuard], loadComponent: () => import('./user/movies/user-movies-list.component').then(m => m.UserMoviesListComponent) },
  { path: 'movies/:id', canActivate: [authGuard], loadComponent: () => import('./features/movie/movie-detail.component').then(m => m.MovieDetailComponent) },

  { path: 'admin/dashboard', canActivate: [adminGuard], loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/manage-movies', canActivate: [adminGuard], loadComponent: () => import('./admin/manage-movies/manage-movies.component').then(m => m.ManageMoviesComponent) },

  { path: 'unauthorized', loadComponent: () => import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
