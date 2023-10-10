import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    let pass = formGroup.get(controlName);
    let confirmPass = formGroup.get(matchingControlName);

    if (pass?.value === confirmPass?.value) {
      confirmPass?.setErrors(null);
      return null;
    } else {
      confirmPass?.setErrors({ notMatch: true });
      return { notMatch: true };
    }
  };
}
