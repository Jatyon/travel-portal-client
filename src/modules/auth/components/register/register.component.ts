import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '@core/services/toast/toast.service';
import { LoaderComponent } from '@shared/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@shared/auth/services/auth.service';
import { AuthRegisterCredentials } from '@shared/auth/models/auth-register-credentials.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  data = new AuthRegisterCredentials();
  isLoading: boolean = false;
  hidePassword = true;
  hidePasswordRepeat = true;
  registerForm = new FormGroup({
    nick: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required]),
  });

  constructor(private readonly router: Router, private readonly authService: AuthService, private readonly toastrService: ToastService) {}

  toggleHide(field: string): void {
    if (field === 'password') this.hidePassword = !this.hidePassword;
    else if (field === 'passwordRepeat') this.hidePasswordRepeat = !this.hidePasswordRepeat;
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      this.toastrService.error('invalid-credentials2');
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.passwordRepeat) {
      this.toastrService.error('Passwords do not match');
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value as AuthRegisterCredentials).subscribe({
      next: (value: boolean) => {
        this.navigate('/auth/login');
      },
      error: (err) => {
        this.isLoading = false;
        err.error.message ? this.toastrService.error('invalid-credentials3') : this.toastrService.error('error connecting to server');
      },
    });
  }

  passwordsMatchValidator(password: string, passwordRepeat: string): boolean {
    return password === passwordRepeat ? true : false;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
