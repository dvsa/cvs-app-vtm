import { Injectable } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormControlOptions, FormGroup, ValidatorFn, Validators } from '@angular/forms';

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
        control = new CustomFormControl({ ...child, readonly: !readonly }, { value, disabled: !!disabled });
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

export enum FormNodeViewTypes {
  STRING = 'string',
  DATE = 'date',
  DATETIME = 'dateTime',
  TIME = 'time'
}

export enum FormNodeTypes {
  ROOT = 'root',
  GROUP = 'group',
  CONTROL = 'control',
  ARRAY = 'array',
  SECTION = 'section'
}

export interface FormNodeOption<T> {
  value: T;
  label: string;
}

export interface FormNode {
  name: string;
  children: FormNode[];
  type: FormNodeTypes; // maybe updateType?
  viewType?: FormNodeViewTypes;
  label?: string;
  value?: string;
  path?: string;
  options?: FormNodeOption<string | number | boolean>[];
  validators?: string[];
  disabled?: boolean;
  readonly?: boolean;
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

export interface CustomGroup extends FormGroup {
  meta: FormNode;
}

export class CustomFormGroup extends FormGroup implements CustomGroup {
  meta: FormNode;

  constructor(
    meta: FormNode,
    controls: {
      [key: string]: AbstractControl;
    },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    this.meta = meta;
  }
}

export interface CustomArray extends FormArray {
  meta: FormNode;
}

export class CustomFormArray extends FormArray implements CustomArray {
  meta: FormNode;

  constructor(meta: FormNode, controls: AbstractControl[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
    this.meta = meta;
  }
}
