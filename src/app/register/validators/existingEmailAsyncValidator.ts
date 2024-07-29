import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { delay, Observable, of, switchMap } from 'rxjs';
import { RegisterService } from '../services/register.service';

export function existingEmailAsyncValidator(
  registerService: RegisterService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (control.invalid) return of(null);

    return of(control.value).pipe(
      delay(500),
      switchMap(async (email) => {
        const result = await registerService.checkEmail(email);

        if (result.result) return { emailExists: true };
        else return null;
      })
    );
  };
}
