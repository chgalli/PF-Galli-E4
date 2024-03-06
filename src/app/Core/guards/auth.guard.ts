import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { AuthService } from '../../Layouts/auth/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService
    .verifyToken()
    .pipe(
      map((isAuthenticated) => isAuthenticated ? true : router.createUrlTree(['auth', 'login'])
      )
    );
};

