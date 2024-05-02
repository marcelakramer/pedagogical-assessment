import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).validateSessionCredentials())
    return true;
  inject(Router).navigate(['auth/admin']);
  return false;
};
