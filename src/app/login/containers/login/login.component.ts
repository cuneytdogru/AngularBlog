import { AsyncPipe, NgIf } from '@angular/common';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/notification.service';
import { SpinnerService } from 'src/app/core/spinner.service';
import { UserService } from 'src/app/core/user.service';
import { LoginRequestDto } from 'src/app/shared/models/auth/loginRequestDto';
import { LoginForm } from '../../models/loginForm';

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
    MatDividerModule,
    MatProgressBarModule,
    AsyncPipe,
  ],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  isLoading$ = this.spinnerService.visibility$;

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

    try {
      const loginRequest = this.loginForm.value as LoginRequestDto;

      await this.userService.login(loginRequest);

      this.notificationService.dismiss();
      this.router.navigate(['main']);
    } catch (err: any) {
      const errorMessage = err?.error?.errorMessage ?? 'Login failed.';
      this.loginForm.setErrors({ invalid: errorMessage });
      this.notificationService.showError(errorMessage);
    }
  }

  signUp() {
    this.router.navigate(['register']);
  }

  forgotPassword() {}
}
