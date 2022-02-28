import { FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export interface FieldState {
  value: string | boolean | number | FormControl[];
  validators?: ValidatorFn[];
}

export interface FormControlsState {
  name: string;
  fieldState: FieldState;
}
export const FORM_UTILS = {
  addControlsToFormGroup
};

function addControlsToFormGroup(formGroup: FormGroup, listOfFields: FormControlsState[]) {
  return listOfFields.map((field) => {
    formGroup.addControl(
      field.name,
      Array.isArray(field.fieldState.value)
        ? new FormArray(field.fieldState.value, field.fieldState.validators)
        : new FormControl(field.fieldState.value, field.fieldState.validators)
    );
  });
}
