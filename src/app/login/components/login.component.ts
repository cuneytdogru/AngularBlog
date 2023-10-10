import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { LoginForm } from '../models/loginForm';
import { AuthService } from 'src/app/core/auth.service';
import { LoginRequestDto } from 'src/app/shared/models/auth/loginRequestDto';
import { NotificationService } from 'src/app/core/notification.service';

@Component({
  standalone: true,
  selector: 'ng-blog-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  loginForm = new FormGroup<LoginForm>({
    userName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get userName() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }

  async login() {
    if (this.loginForm.invalid) return;

    const loginRequest = this.loginForm.value as LoginRequestDto;
    const response = await this.authService.login(loginRequest);

    if (response.isError)
      this.notificationService.showError(
        response.errorMessage ?? 'Login failed.'
      );
    else this.router.navigate(['main']);
  }

  signUp() {
    this.router.navigate(['register']);
  }

  forgotPassword() {}
}
