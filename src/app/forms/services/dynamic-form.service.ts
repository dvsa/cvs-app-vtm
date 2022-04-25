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

    f?.children.forEach((child) => {
      const { name, type, value, validators } = child;
      let control;
      if ('group' === type) {
        control = this.createForm(child);
      } else {
        control = new CustomFormControl(child, value);
      }

      if (!control) {
        throw new Error('invalid control type');
      }

      if (validators && validators.length > 0) {
        this.addValidators(control, validators);
      }

      form.addControl(name, control);
    });

    return form;
  }

  addValidators(control: FormGroup | CustomFormControl, validators: Array<string> = []) {
    validators.forEach((v: string) => {
      control.addValidators(this.validatorMap[v]);
    });
  }
}

export enum FormNodeViewTypes {
  STRING = 'string',
  DATE = 'date',
  DATETIME = 'dateTime',
  TIME = 'time'
}
export enum FormNodeTypes {
  GROUP = 'group',
  CONTROL = 'control'
}
export interface FormNode {
  name: string;
  children: FormNode[];
  type: FormNodeTypes; // maybe updateType?
  viewType?: FormNodeViewTypes;
  label?: string;
  value?: string;
  path?: string;
  validators?: string[];
}

export interface CustomControl extends FormControl {
  meta: FormNode;
}

export class CustomFormControl extends FormControl implements CustomControl {
  meta: FormNode;

  constructor(meta: FormNode, formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);
    this.meta = meta;
  }
}
