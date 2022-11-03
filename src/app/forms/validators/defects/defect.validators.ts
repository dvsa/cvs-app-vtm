import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';

export class DefectValidators {
  static validateDefectNotes: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control?.parent && control.parent.parent) {
      const grandParent = control.parent.parent;
      const defCategory = grandParent?.get('deficiencyCategory')?.value as deficiencyCategory;
      const prohibitionIssued = grandParent.get('prohibitionIssued')?.value as boolean;
      const stdForProhibition = grandParent.get('stdForProhibition')?.value as boolean;

      if (
        !control.value &&
        (defCategory === deficiencyCategory.Advisory || (defCategory === deficiencyCategory.Dangerous && stdForProhibition && !prohibitionIssued))
      ) {
        return { validateDefectNotes: true };
      }
    }
    return null;
  };

  static validateProhibitionIssued: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control?.parent) {
      const defCategory = control.parent.get('deficiencyCategory')?.value as deficiencyCategory;
      const stdForProhibition = control.parent.get('stdForProhibition')?.value as boolean;
      const prohibitionIssued = control.value as boolean;

      if (defCategory === deficiencyCategory.Dangerous && !stdForProhibition && !prohibitionIssued) {
        return { validateProhibitionIssued: true };
      }
    }
    return null;
  };
}
