import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Blocks access to guest-only pages (login, register) when already authenticated. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return true;

  const user = auth.getCurrentUser();
  switch (user?.role) {
    case 'ADMIN':      router.navigate(['/admin']);      break;
    case 'PROFESSOR':  router.navigate(['/professor']);  break;
    case 'STUDENT':    router.navigate(['/courses']);    break;
    default:           router.navigate(['/dashboard']);
  }
  return false;
};
