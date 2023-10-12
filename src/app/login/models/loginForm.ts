import { FormControl } from '@angular/forms';

export interface LoginForm {
  userName: FormControl<string>;
  password: FormControl<string>;
}
