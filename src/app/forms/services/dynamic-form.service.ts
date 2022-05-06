import { Injectable, Optional } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormControlOptions, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor() {}

  validatorMap: { [key: string]: ValidatorFn } = {
    required: Validators.required
  };

  createForm(f: FormNode, d: any = {}): CustomFormGroup | CustomFormArray {
    if (!f) {
      return new CustomFormGroup(f, {});
    }

    const { type } = f;
    let form: CustomFormGroup | CustomFormArray = FormNodeTypes.ARRAY === type ? new CustomFormArray(f, []) : new CustomFormGroup(f, {});

    f?.children.forEach((child) => {
      const { name, type, value, validators, disabled, readonly } = child;
      let control: any;

      if (FormNodeTypes.CONTROL !== type) {
        control = this.createForm(child, d[name]);
      } else {
        control = new CustomFormControl({ ...child, readonly: !!readonly }, { value, disabled: !!disabled });
      }

      if (validators && validators.length > 0) {
        this.addValidators(control, validators);
      }

      if (form instanceof FormGroup) {
        form.addControl(name, control);
      } else if (form instanceof FormArray) {
        this.createControls(child, d).forEach((control) => {
          (form as FormArray).push(control);
        });
      }
    });

    return form;
  }

  createControls(child: FormNode, d: any) {
    const controls: any[] = [];
    if (d.length && d.length > 0) {
      d.forEach(() => {
        if (FormNodeTypes.CONTROL !== child.type) {
          controls.push(this.createForm(child, d[child.name]));
        } else {
          controls.push(new CustomFormControl({ ...child, readonly: !!child.readonly }, { value: child.value, disabled: !!child.disabled }));
        }
      });
    } else {
      controls.push(new CustomFormControl({ ...child, readonly: !!child.readonly }, { value: child.value, disabled: !!child.disabled }));
    }
    return controls;
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
  TIME = 'time',
  VEHICLETYPE = 'vehicleType'
}

export enum FormNodeTypes {
  GROUP = 'group',
  CONTROL = 'control',
  ARRAY = 'array'
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
