import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthService } from '@shared/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
  constructor(private readonly authService: AuthService) {}

  resolve() {
    return this.authService.isAuthenticated();
  }
}
