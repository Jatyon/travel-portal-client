import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '@core/services/toast/toast.service';
import { AuthForgotPasswordCredentials } from '@shared/auth/models/auth-forgot-password-credentials.model';
import { AuthLoginCredentials } from '@shared/auth/models/auth-login-credentials.model';
import { LoaderComponent } from '@shared/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@shared/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  data = new AuthLoginCredentials();
  isLoading: boolean = false;
  isSentForm: boolean = false;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private readonly router: Router, private readonly authService: AuthService, private readonly toastrService: ToastService) {}

  onSubmit() {
    if (!this.form.valid) {
      this.toastrService.error('invalid-credentials1');
      return;
    }
    this.isLoading = true;

    this.authService.forgotPasswordEmail(this.form.value as AuthForgotPasswordCredentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSentForm = true;
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
