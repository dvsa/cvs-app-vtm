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

  createForm(formNode: FormNode, data: any = {}): CustomFormGroup | CustomFormArray {
    if (!formNode) {
      return new CustomFormGroup(formNode, {});
    }

    const form: CustomFormGroup | CustomFormArray = FormNodeTypes.ARRAY === formNode.type ? new CustomFormArray(formNode, []) : new CustomFormGroup(formNode, {});

    formNode.children?.forEach(child => {
      const { name, type, value, validators, disabled } = child;

      const control = FormNodeTypes.CONTROL !== type
        ? this.createForm(child, data[name])
        : new CustomFormControl({ ...child }, { value, disabled: !!disabled });

      if (validators && validators.length > 0) {
        this.addValidators(control, validators);
      }

      if (form instanceof FormGroup) {
        form.addControl(name, control);
      } else if (form instanceof FormArray) {
        this.createControls(child, data).forEach(element => form.push(element));
      }
    });

    return form;
  }

  createControls(child: FormNode, data: any): any[] {
    const defaultFormControl = new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled });

    if (!data.length || data.length === 0) {
      return [defaultFormControl];
    }

    // Note: There's a quirk here when dealing with arrays where if
    // `d` is a array then `child.name` should be a correct index so
    // make sure the template has the correct name to the node.
    return data.map(() => FormNodeTypes.CONTROL !== child.type ? this.createForm(child, data[child.name]) : defaultFormControl);
  }

  addValidators(control: CustomFormGroup | CustomFormArray | CustomFormControl, validators: Array<string>) {
    validators.forEach(v => control.addValidators(this.validatorMap[v]));
  }
}
