import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ThemePreset } from './core/themes/preset';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastService } from './core/services/toast.service';
import { AuthRetryInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRetryInterceptor,
      multi: true,
    },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth.audience
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
