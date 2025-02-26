import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoginResult } from '../models/auth-login-result.model';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    if (authToken) req = this.addTokenToRequest(req, authToken);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (this.authService.getRefreshToken()) return this.handle401Error(req, next);
        }

        return throwError(() => error);
      }),
    );
  }

  private addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.refreshToken()).pipe(
      switchMap((newLoginData: AuthLoginResult) => {
        this.authService.saveTokens(newLoginData);

        return next.handle(this.addTokenToRequest(req, newLoginData.token));
      }),
      catchError((error: HttpErrorResponse) => {
        this.authService.logoutLocal();
        this.router.navigate(['/login']);
        return throwError(() => error);
      }),
    );
  }
}
