import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Cookies from 'js-cookie';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // If user has a token, redirect to dashboard
  const hasToken = !!Cookies.get('token');

  if (hasToken) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
