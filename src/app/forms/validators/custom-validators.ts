import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';

export class CustomValidators {
  static hideIfEmpty = (sibling: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;
        siblingControl.meta.hide = !control.value;
      }

      return null;
    };
  };

  static hideIfEquals = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;

        siblingControl.meta.hide = Array.isArray(value) && control.value ? value.includes(control.value) : control.value === value;
      }

      return null;
    };
  };

  static hideIfNotEqual = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;

        siblingControl.meta.hide = Array.isArray(value) ? !value.includes(control.value) : control.value !== value;
      }

      return null;
    };
  };

  static enableIfEquals = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;
        const isEqual = Array.isArray(value) ? value.includes(control.value) : control.value === value;
        isEqual ? siblingControl.enable() : siblingControl.disable();
      }
      return null;
    };
  };

  static disableIfEquals = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;
        const isEqual = Array.isArray(value) ? value.includes(control.value) : control.value === value;
        isEqual ? siblingControl.disable() : siblingControl.enable();
      }
      return null;
    };
  };

  static hideIfParentSiblingNotEqual = (parentSibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent && control.parent.parent) {
        const siblingControl = control.parent.parent.get(parentSibling) as CustomFormControl;

        siblingControl.meta.hide = Array.isArray(value) ? !value.includes(control.value) : control.value !== value;
      }

      return null;
    };
  };

  static hideIfParentSiblingEquals = (parentSibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent && control.parent.parent) {
        const siblingControl = control.parent.parent.get(parentSibling) as CustomFormControl;
        siblingControl.meta.hide = Array.isArray(value) && control.value ? value.includes(control.value) : control.value === value;
      }

      return null;
    };
  };

  static requiredIfEquals = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;
        const siblingValue = siblingControl.value;
        const newValue = Array.isArray(value) ? value.includes(siblingValue) : siblingValue === value;

        if (newValue && (control.value === null || control.value === undefined || control.value === '')) {
          return { requiredIfEquals: { sibling: siblingControl.meta.label } };
        }
      }

      return null;
    };
  };

  static requiredIfNotEqual = (sibling: string, value: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;
        const siblingValue = siblingControl.value;
        const newValue = Array.isArray(value) ? value.includes(siblingValue) : siblingValue === value;

        if (!newValue && (control.value === null || control.value === undefined || control.value === '')) {
          return { requiredIfNotEqual: { sibling: siblingControl.meta.label } };
        }
      }

      return null;
    };
  };

  static defined = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (typeof control.value === 'undefined') {
        return { defined: false };
      }
      return null;
    };
  };

  static alphanumeric(): ValidatorFn {
    return this.customPattern(['^[a-zA-Z0-9]*$', 'must be alphanumeric']);
  }

  static numeric(): ValidatorFn {
    return this.customPattern(['^\\d*$', 'must be a whole number']);
  }

  static customPattern([regEx, message]: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const valid = new RegExp(regEx).test(control.value);

      return valid ? null : { customPattern: { message } };
    };
  }

  static invalidOption: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return '[INVALID_OPTION]' === control.value ? { invalidOption: true } : null;
  };

  static pastDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const now = new Date();
    const date = control.value;
    if (date && new Date(date).getTime() > now.getTime()) {
      return { pastDate: true };
    }
    return null;
  };

  static futureDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const now = new Date();
    const date = control.value;
    if (date && new Date(date).getTime() < now.getTime()) {
      return { futureDate: true };
    }
    return null;
  };

  static aheadOfDate = (sibling: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const siblingControl = control?.parent?.get(sibling);
      if (siblingControl?.value && control.value && new Date(control.value) < new Date(siblingControl.value)) {
        return { aheadOfDate: { sibling: (siblingControl as CustomFormControl).meta.label } };
      }

      return null;
    };
  };

  static dateNotExceed = (sibling: string, months: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const siblingControl = control?.parent?.get(sibling);
      if (siblingControl?.value) {
        const maxDate = new Date(siblingControl.value);
        maxDate.setMonth(maxDate.getMonth() + months);

        if (new Date(control.value) > maxDate) {
          return { dateNotExceed: { sibling: (siblingControl as CustomFormControl).meta.label, months: months } };
        }
      }

      return null;
    };
  };

  /**
   * Validator that copies control value to control of given name at the top-level ancestor of control.
   * @param rootControlName - control in top-level ancestor of this control
   * @returns null
   */
  static copyValueToRootControl = (rootControlName: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const rootControl = control.root.get(rootControlName);
      if (rootControl) {
        rootControl.setValue(control.value, { onlySelf: true, emitEvent: false });
      }
      return null;
    };
  };
}
