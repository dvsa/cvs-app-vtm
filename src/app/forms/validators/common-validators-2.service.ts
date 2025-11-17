import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';

export class CommonValidators2Service {

  min(size: number, controlName: string): ValidatorFn {
    return (control) => {
      if (control.value && control.value < size) {
        return { min: `${controlName} must be greater than or equal to ${size}` };
      }

      return null;
    };
  }

  required(controlName: string): ValidatorFn {
    return (control) => {
      if (control.parent && (!control.value || (Array.isArray(control.value) && control.value.length === 0))) {
        return { required: `${controlName} is required` };
      }

      return null;
    };
  }
  maxLength(length: number, controlName: string): ValidatorFn {
    return (control) => {
      if (control.value && control.value.length > length) {
        return { maxLength: `${controlName} must be less than or equal to ${length} characters` };
      }

      return null;
    };
  }

  max(size: number, controlName: string): ValidatorFn {
    return (control) => {
      if (control.value && control.value > size) {
        return { max: `${controlName} must be less than or equal to ${size}` };
      }

      return null;
    };
  }

  xYearsAfterCurrent(xYears: number, controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentYear = new Date().getFullYear();
      const inputYear = control.value;
      const maxYear = currentYear + xYears;
      if (inputYear && (inputYear > maxYear || inputYear < 0)) {
        return { xYearsAfterCurrent: `${controlName} must be equal to or before ${new Date().getFullYear() + xYears}` };
      }

      return null;
    };
  }

  range(min: number, max: number, controlName: string): ValidatorFn {
    return (control) => {
      if (!control.value) return null;
      if (typeof control.value !== 'number') return null;

      if (control.value < min || control.value > max) {
        return { range: `${controlName} must be between ${min} and ${max}` };
      }

      return null;
    };
  }
}
