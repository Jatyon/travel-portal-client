import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AuthLoginResult } from '@shared/auth/models/auth-login-result.model';
import { AuthForgotPasswordCredentials } from '../models/auth-forgot-password-credentials.model';
import { AuthChangePasswordCredentials } from '../models/auth-change-password-credentials.model';
import { AuthRegisterCredentials } from '../models/auth-register-credentials.model';
import { AuthLoginCredentials } from '../models/auth-login-credentials.model';
import { ProfileInfoUser } from '../models/profile-info-user.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$ = new BehaviorSubject<ProfileInfoUser | null>(null);

  constructor(private readonly httpClient: HttpClient) {}

  get user(): ProfileInfoUser | null {
    return this.user$.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  saveTokens(token: AuthLoginResult): void {
    localStorage.setItem(ACCESS_TOKEN, token.token);
    localStorage.setItem(REFRESH_TOKEN, token.refreshToken);
  }

  removeTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  logoutLocal(): void {
    this.removeTokens();
    this.user$.next(null);
  }

  login(credentials: AuthLoginCredentials): Observable<AuthLoginResult> {
    return this.httpClient.post<AuthLoginResult>(`${environment.host}/auth/login`, credentials).pipe(map((r) => plainToClass(AuthLoginResult, r)));
  }

  register(credentials: AuthRegisterCredentials): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.host}/auth/register`, credentials);
  }

  forgotPasswordEmail(credentials: AuthForgotPasswordCredentials): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.host}/auth/forgot-password`, credentials);
  }

  forgotPasswordToken(token: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.host}/auth/forgot-password/${token}`);
  }

  changePassword(credentials: AuthChangePasswordCredentials): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.host}/auth/change-password`, credentials);
  }

  refreshToken(): Observable<AuthLoginResult> {
    const refreshToken: string = this.getRefreshToken() as string;

    return this.httpClient.post<AuthLoginResult>(`${environment.host}/auth/refresh-token`, { refreshToken }).pipe(map((r) => plainToClass(AuthLoginResult, r)));
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${environment.host}/auth/logout`, {});
  }

  isLoggedIn(): Observable<ProfileInfoUser> {
    return this.httpClient.get<ProfileInfoUser>(`${environment.host}/user/profile`);
  }

  // isAllowed(...rights: string[]): boolean {
  //   if (this.isAuthenticated && rights.length === 0) {
  //     return this.isAuthenticated;
  //   }

  //   const hasRight = (): boolean => this.user.rights.some((right: string) => rights.includes(right));
  //   return this.isAuthenticated && (!this.user.rights || hasRight());
  // }
}
