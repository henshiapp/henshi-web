import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ThemePreset } from './core/themes/preset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastService } from './core/services/toast.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideRouter(routes),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin + '/app/dashboard',
        audience: environment.auth.audience
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: environment.api.url + '/*',
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth.audience
              }
            }
          }
        ]
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ThemePreset
      }
    }),
    MessageService,
    ToastService,
    ConfirmationService
  ]
};
