import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { AppSocketService } from '@shared/app-socket/services/app-socket.service';
import { AuthInterceptor } from '@shared/auth/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '@shared/auth/services/auth.service';
import { provideToastr, ToastrService } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideToastr(),
    provideAnimationsAsync(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (authService: AuthService, router: Router) {
        return new AuthInterceptor(authService, router);
      },
      multi: true,
      deps: [AuthService, Router],
    },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: AuthInterceptor, useClass: AuthInterceptor },
    { provide: AppSocketService, useClass: AppSocketService },
    { provide: AuthService, useClass: AuthService },
    { provide: ToastrService, useClass: ToastrService },
  ],
};
