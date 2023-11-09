import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
// eslint-disable-next-line import/no-cycle
import { CustomFormControl, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';

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

  static requiredIfEquals = (sibling: string, values: any[]): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      if (!control?.parent) return null;

      const siblingControl = control.parent.get(sibling) as CustomFormControl;
      const siblingValue = siblingControl.value;
      const isSiblingValueIncluded = values.includes(siblingValue);
      const isControlValueEmpty = control.value === null || control.value === undefined || control.value === '';

      return isSiblingValueIncluded && isControlValueEmpty ? { requiredIfEquals: { sibling: siblingControl.meta.label } } : null;
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

  static mustEqualSibling = (sibling: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;
        const siblingValue = siblingControl.value;
        const isEqual = Array.isArray(control.value) ? control.value.includes(siblingValue) : siblingValue === control.value;

        if (!isEqual) {
          return { mustEqualSibling: { sibling: siblingControl.meta.label } };
        }
      }

      return null;
    };
  };

  static validateVRMTrailerIdLength = (sibling: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (control?.parent) {
        const siblingControl = control.parent.get(sibling) as CustomFormControl;
        const siblingValue = siblingControl.value;

        const isTrailerValueSelected = siblingValue === VehicleTypes.TRL;

        if (isTrailerValueSelected) {
          if (control.value.length < 7) {
            return { validateVRMTrailerIdLength: { message: 'Trailer ID must be greater than or equal to 7 characters' } };
          }
          if (control.value.length > 8) {
            return { validateVRMTrailerIdLength: { message: 'Trailer ID must be less than or equal to 8 characters' } };
          }
        } else {
          if (control.value.length < 1) {
            return { validateVRMTrailerIdLength: { message: 'VRM must be greater than or equal to 1 character' } };
          }
          if (control.value.length > 9) {
            return { validateVRMTrailerIdLength: { message: 'VRM must be less than or equal to 9 characters' } };
          }
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

  static validateVinCharacters() {
    return this.customPattern(['^(?!.*[OIQ]).*$', 'should not contain O, I or Q']);
  }
  static alphanumeric(): ValidatorFn {
    return this.customPattern(['^[a-zA-Z0-9]*$', 'must be alphanumeric']);
  }

  static numeric(): ValidatorFn {
    return this.customPattern(['^\\d*$', 'must be a whole number']);
  }

  static email(): ValidatorFn {
    return this.customPattern(['^[\\w\\-\\.\\+]+@([\\w-]+\\.)+[\\w-]{2,}$', 'Enter an email address in the correct format, like name@example.com']);
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
    return control.value === '[INVALID_OPTION]' ? { invalidOption: true } : null;
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
        return { aheadOfDate: { sibling: (siblingControl as CustomFormControl).meta.label, date: new Date(siblingControl.value) } };
      }

      return null;
    };
  };

  static dateNotExceed = (sibling: string, months: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const siblingControl = control?.parent?.get(sibling);
      if (siblingControl?.value && control.value) {
        const maxDate = new Date(siblingControl.value);
        maxDate.setMonth(maxDate.getMonth() + months);

        if (new Date(control.value) > maxDate) {
          return { dateNotExceed: { sibling: (siblingControl as CustomFormControl).meta.label, months } };
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

  static notZNumber = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const isZNumber = /^[0-9]{7}[zZ]$/.test(control.value);

    return !isZNumber ? null : { notZNumber: true };
  };

  static handlePsvPassengersChange = (passengersOne: string, passengersTwo: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.dirty) {
        const controlOne: number = control.root.get(passengersOne)?.value;
        const controlTwo: number = control.root.get(passengersTwo)?.value;
        const controlThree: number = control.value;

        const classControl = control.root.get('techRecord_vehicleClass_description');
        const sizeControl = control.root.get('techRecord_vehicleSize');

        const totalPassengers = controlOne + controlTwo + controlThree;

        switch (true) {
          case totalPassengers <= 22: {
            sizeControl?.setValue(VehicleSizes.SMALL, { emitEvent: false });
            classControl?.setValue(VehicleClassDescription.SmallPsvIeLessThanOrEqualTo22Seats, { emitEvent: false });
            break;
          }
          default: {
            sizeControl?.setValue(VehicleSizes.LARGE, { emitEvent: false });
            classControl?.setValue(VehicleClassDescription.LargePsvIeGreaterThan23Seats, { emitEvent: false });
          }
        }
        control.markAsPristine();
      }
      return null;
    };
  };

  static updateFunctionCode = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const vehicleFunctionCode = control.root.get('techRecord_functionCode');
      const functionCodes: Record<string, string> = {
        rigid: 'R',
        articulated: 'A',
        'semi-trailer': 'A',
      };

      if (control.dirty) {
        vehicleFunctionCode?.setValue((functionCodes[control?.value]), { emitEvent: false });
        control.markAsPristine();
      }
      return null;
    };
  };

  static toggleGroup = (groups: string[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.dirty) {
        const parentGroup = control.parent as CustomFormGroup;
        parentGroup.meta.children?.forEach((child) => {
          const childControl = parentGroup.get(child.name) as CustomFormControl;
          const childGroups = childControl?.meta.groups;
          childGroups?.forEach((group) => {
            if (groups.includes(group)) {
              childControl.meta.hide = !childControl.meta.hide;
            }
          });
        });
        control.markAsPristine();
      }
      return null;
    };
  };
}
