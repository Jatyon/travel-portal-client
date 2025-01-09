import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastService } from '@core/services/toast/toast.service';
import { AuthChangePasswordCredentials } from '@shared/auth/models/auth-change-password-credentials.model';
import { AuthLoginCredentials } from '@shared/auth/models/auth-login-credentials.model';
import { LoaderComponent } from '@shared/loader/loader.component';
import { AuthService } from '@shared/auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  data = new AuthLoginCredentials();
  isLoading: boolean = false;
  hidePassword = true;
  hidePasswordRepeat = true;
  isSentForm: boolean = false;
  token!: string;
  form = new FormGroup({
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required]),
  });

  constructor(private readonly router: Router, private route: ActivatedRoute, private readonly authService: AuthService, private readonly toastrService: ToastService) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('id')!;
  }

  toggleHide(field: string): void {
    if (field === 'password') this.hidePassword = !this.hidePassword;
    else if (field === 'passwordRepeat') this.hidePasswordRepeat = !this.hidePasswordRepeat;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.toastrService.error('invalid-credentials1');
      return;
    }
    this.isLoading = true;

    const credentials: AuthChangePasswordCredentials = {
      password: this.form.value.password as string,
      passwordRepeat: this.form.value.passwordRepeat as string,
      token: this.token,
    };

    this.authService.changePassword(credentials).subscribe({
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
