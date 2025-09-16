import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, allow rendering to avoid hydration mismatches
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (auth.isAuthenticated() && auth.role() === 'ADMIN') {
    return true;
  }
  
  // If user is authenticated but not admin, redirect to unauthorized
  if (auth.isAuthenticated()) {
    router.navigate(['/unauthorized']);
    return false;
  }
  
  // If not authenticated at all, redirect to login
  router.navigate(['/login']);
  return false;
};