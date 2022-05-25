import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormControlOptions, FormGroup, ValidatorFn } from '@angular/forms';

export enum FormNodeViewTypes {
  STRING = 'string',
  DATE = 'date',
  DATETIME = 'dateTime',
  TIME = 'time',
  HIDDEN = 'hidden',
  VEHICLETYPE = 'vehicleType',
  SUBHEADING = 'subHeading'
}

export enum FormNodeTypes {
  ROOT = 'root',
  GROUP = 'group',
  CONTROL = 'control',
  ARRAY = 'array',
  SECTION = 'section',
  COMBINATION = 'combination'
}

export interface FormNodeOption<T> {
  value: T;
  label: string;
}

export interface FormNode {
  name: string;
  children?: FormNode[];
  type: FormNodeTypes; // maybe updateType?
  viewType?: FormNodeViewTypes;
  label?: string;
  value?: string;
  path?: string;
  options?: FormNodeOption<string | number | boolean>[] | FormNodeCombinationOptions;
  validators?: { name: string; args: any[] }[];
  disabled?: boolean;
  readonly?: boolean;
  hide?: boolean;
}

export interface FormNodeCombinationOptions {
  leftComponentName: string;
  rightComponentName: string;
  separator: string;
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
