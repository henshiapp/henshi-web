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
import { provideQuillConfig } from 'ngx-quill/config';
import hljs from 'highlight.js';
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs';
import { baseUrlHttpInterceptorFn } from './core/interceptors/base-url.interceptor';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([baseUrlHttpInterceptorFn, authHttpInterceptorFn])),
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
        preset: ThemePreset,
        options: {
          darkModeSelector: '.dark',
          scheme: 'dark'
        }
      },
    }),
    provideQuillConfig({
      theme: 'snow',
      modules: {
        syntax: { hljs },
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            ['link', 'formula'], //['link', 'image', 'video', 'formula'],

            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],

            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'align': [] }],
          ]
        }
      },
    }),
    MessageService,
    ToastService,
    ConfirmationService
  ]
};
