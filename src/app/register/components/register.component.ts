import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RegisterForm } from '../models/registerForm';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegisterService } from '../services/register.service';
import { RegisterDto } from 'src/app/shared/models/register/registerDto';
import { matchValidator } from 'src/app/shared/validators/matchValidator';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/notification.service';

@Component({
  standalone: true,
  selector: 'ng-blog-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent {
  constructor(
    private registerService: RegisterService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  registerForm = new FormGroup<RegisterForm>(
    {
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      userName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmation: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    {
      validators: [matchValidator('password', 'confirmPassword')],
    }
  );

  get fullName() {
    return this.registerForm.get('fullName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get userName() {
    return this.registerForm.get('userName');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  async register() {
    const registerDto = this.registerForm.value as RegisterDto;
    const user = await this.registerService.registerUser(registerDto);

    this.notificationService.showSuccess('User registered.');

    this.router.navigate(['']);
  }

  cancel() {
    this.registerForm.reset();
    window.history.back();
  }
}
