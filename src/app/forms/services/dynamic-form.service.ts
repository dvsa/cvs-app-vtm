import { Injectable } from '@angular/core';
import { FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormNode, CustomFormGroup, CustomFormControl, CustomFormArray, FormNodeTypes } from './dynamic-form.types';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor() {}

  validatorMap: { [key: string]: ValidatorFn } = {
    required: Validators.required
  };

  createForm(f: FormNode): CustomFormGroup | CustomFormArray {
    if (!f) {
      return new CustomFormGroup(f, {});
    }

    const { type } = f;
    let form: CustomFormGroup | CustomFormArray = FormNodeTypes.ARRAY === type ? new CustomFormArray(f, []) : new CustomFormGroup(f, {});

    f?.children.forEach((child) => {
      const { name, type, value, validators, disabled, readonly } = child;
      let control;
      if (FormNodeTypes.CONTROL !== type) {
        control = this.createForm(child);
      } else {
        control = new CustomFormControl({ ...child, readonly: true }, { value, disabled: !!disabled });
      }

      if (validators && validators.length > 0) {
        this.addValidators(control, validators);
      }

      if (form instanceof FormGroup) {
        form.addControl(name, control);
      } else if (form instanceof FormArray) {
        form.push(control);
      }
    });

    return form;
  }

  addValidators(control: CustomFormGroup | CustomFormArray | CustomFormControl, validators: Array<string> = []) {
    validators.forEach((v: string) => {
      control.addValidators(this.validatorMap[v]);
    });
  }
}
