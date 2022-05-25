import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static validDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if ('Invalid Date' === new Date(control.value).toString()) {
      return { invalidDate: true };
    }

    return null;
  };
}
