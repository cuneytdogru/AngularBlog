import { FormControl } from '@angular/forms';

export interface RegisterForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
  userName: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  confirmation?: FormControl<boolean>;
}
