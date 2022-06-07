import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';

export class CustomValidator {
  static hide = (sibling: string): ValidatorFn => {
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
}
