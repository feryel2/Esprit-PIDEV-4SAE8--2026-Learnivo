import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const expectedRoles = route.data['roles'] as string[] | undefined;

  if (user && (!expectedRoles || expectedRoles.includes(user.role))) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
