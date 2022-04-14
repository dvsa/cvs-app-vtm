import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormControlOptions, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor() {}

  validatorMap: { [key: string]: ValidatorFn } = {
    required: Validators.required
  };

  createForm(f: FormNode): FormGroup {
    let form: FormGroup = new FormGroup({});

    f.children.forEach((child) => {
      const { name, type, value } = child;
      let control;
      if ('group' === type) {
        control = this.createForm(child);
      } else {
        control = new CustomFormControl(child, value);
      }
      if (!control) {
        throw new Error('invalid control type');
      }

      form.addControl(name, control);
    });

    return form;
  }

  addValidators(control: FormControl, validators: Array<string> = []) {
    validators.forEach((v: string) => {
      control.addValidators(this.validatorMap[v]);
    });
  }
}

export interface FormNode {
  name: string;
  children: FormNode[];
  type: 'control' | 'group' | 'array';
  label?: string;
  value?: string;
  path?: string;
  validators?: string[];
}

interface CustomControl extends FormControl {
  meta: FormNode;
}

class CustomFormControl extends FormControl implements CustomControl {
  meta: FormNode;

  constructor(meta: FormNode, formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);
    this.meta = meta;
  }
}
