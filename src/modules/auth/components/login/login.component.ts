import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ToastService } from '@core/services/toast/toast.service';
import { AuthLoginCredentials } from '@shared/auth/models/auth-login-credentials.model';
import { LoaderComponent } from '@shared/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@shared/auth/services/auth.service';
import { AuthLoginResult } from '@shared/auth/models/auth-login-result.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  data = new AuthLoginCredentials();
  isLoading: boolean = false;
  hide = signal(true);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private readonly router: Router, private readonly authService: AuthService, private readonly toastrService: ToastService) {}

  toggleHide(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.toastrService.error('invalid-credentials');
      return;
    }
    this.isLoading = true;

    this.authService.login(this.loginForm.value as AuthLoginCredentials).subscribe({
      next: (value: AuthLoginResult) => {
        this.isLoading = false;
        this.authService.loginLocal(value);
        this.navigate('/');
      },
      error: (err) => {
        this.isLoading = false;
        err.error.message ? this.toastrService.error(err.error.message) : this.toastrService.error('error connecting to server');
      },
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
