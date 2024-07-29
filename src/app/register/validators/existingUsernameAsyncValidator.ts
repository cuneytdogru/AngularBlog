import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { delay, Observable, of, switchMap } from 'rxjs';
import { RegisterService } from '../services/register.service';

export function existingUsernameAsyncValidator(
  registerService: RegisterService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (control.invalid) return of(null);

    return of(control.value).pipe(
      delay(500),
      switchMap(async (username) => {
        const result = await registerService.checkUsername(username);

        if (result.result) return { usernameExists: true };
        else return null;
      })
    );
  };
}
