import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { select, Store } from '@ngrx/store';
import { testResultInEdit, TestResultsState } from '@store/test-records';
import { map, Observable, take } from 'rxjs';

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

        if (newValue && (control.value === null || control.value === undefined)) {
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

        if (!newValue && (control.value === null || control.value === undefined)) {
          return { requiredIfNotEqual: { sibling: siblingControl.meta.label } };
        }
      }

      return null;
    };
  };

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

  static resultDependantOnCustomDefects(store: Store<TestResultsState>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      store.pipe(
        take(1),
        select(testResultInEdit),
        map(testResult => {
          const hasCustomDefects = testResult?.testTypes?.some(testType => testType?.customDefects && testType.customDefects.length > 0);

          if (control.value === 'pass' && hasCustomDefects) {
            return { invalidTestResult: { message: 'Cannot pass test when defects are present' } };
          } else if (control.value === 'fail' && !hasCustomDefects) {
            return { invalidTestResult: { message: 'Cannot fail test when no defects are present' } };
          } else if (control.value === 'prs' && !hasCustomDefects) {
            return { invalidTestResult: { message: 'Cannot mark test as PRS when no defects are present' } };
          } else {
            return null;
          }
        })
      );
  }
}
