import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthenticationService);
  const authenticated = await firstValueFrom(authService.isAuthenticated$);

  return authenticated;
};
