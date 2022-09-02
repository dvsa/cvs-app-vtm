import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';

export class DefectValidators {
  static validateDefectNotes: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control?.parent && control.parent.parent) {
      const grandParent = control.parent.parent;
      const prohibitionIssued = grandParent.get('prohibitionIssued') as CustomFormControl;
      const deficiencyCategory = grandParent?.get('deficiencyCategory') as CustomFormControl;
      if (!control.value
        && deficiencyCategory.value === 'advisory'
        || (deficiencyCategory.value === 'dangerous*' && prohibitionIssued.value === false)) {
        return { validateDefectNotes: true };
      }
    }
    return null;
  };
}
