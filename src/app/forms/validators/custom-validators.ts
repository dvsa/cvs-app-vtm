import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';

export class CustomValidators {
  static hideIfEmpty = (sibling: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const siblingControl = control.parent?.get(sibling);
      if (!control?.value) {
        (siblingControl as CustomFormControl).meta.hide = true;
      } else {
        (siblingControl as CustomFormControl).meta.hide = false;
      }
      return null;
    };
  };
  static hideIfEquals = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const siblingControl = control.parent?.get(sibling);
      if (Array.isArray(value) && control.value) {
        if (value.includes(control.value)) {
          (siblingControl as CustomFormControl).meta.hide = true;
        } else {
          (siblingControl as CustomFormControl).meta.hide = false;
        }
      } else {
        if (control?.value == value) {
          (siblingControl as CustomFormControl).meta.hide = true;
        } else {
          (siblingControl as CustomFormControl).meta.hide = false;
        }
      }
      return null;
    };
  };

  static hideIfNotEqual = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const siblingControl = control.parent?.get(sibling);
      if (Array.isArray(value)) {
        if (!value.includes(control.value)) {
          (siblingControl as CustomFormControl).meta.hide = true;
        } else {
          (siblingControl as CustomFormControl).meta.hide = false;
        }
      } else {
        if (control?.value !== value) {
          (siblingControl as CustomFormControl).meta.hide = true;
        } else {
          (siblingControl as CustomFormControl).meta.hide = false;
        }
      }
      return null;
    };
  };

  static numeric(): ValidatorFn {
    return this.customPattern(['^\\d*$', 'must be a number']);
  }

  static customPattern([regEx, message]: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = new RegExp(regEx).test(control.value);
      return valid ? null : { customPattern: { message } };
    };
  }
}
