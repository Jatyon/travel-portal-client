import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileInfoUser } from '../models/profile-info-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.isLoggedIn().subscribe({
        next: (resp: ProfileInfoUser) => {
          this.authService.user$.next(resp);
          return resolve(true);
        },
        error: () => {
          return reject(false);
        },
      });
    });
  }

  async canActivate(): Promise<boolean> {
    try {
      return await this.isLoggedIn();
    } catch (error) {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
