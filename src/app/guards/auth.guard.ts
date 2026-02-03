import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Cookies from 'js-cookie';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if user has a valid token
  const hasToken = !!Cookies.get('token');

  if (hasToken) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/login']);
  return false;
};
