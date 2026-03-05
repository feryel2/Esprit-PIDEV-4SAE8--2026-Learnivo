import { CanActivateFn } from '@angular/router';

// Stub guard – always allows access. Replace with real auth check when ready.
export const authGuard: CanActivateFn = () => true;
