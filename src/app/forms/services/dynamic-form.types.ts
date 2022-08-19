import { ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormControlOptions,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { ValidatorNames } from '@forms/models/validators.enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { map, Observable } from 'rxjs';
import { DynamicFormService } from './dynamic-form.service';
import { SpecialRefData } from './multi-options.service';

export enum FormNodeViewTypes {
  STRING = 'string',
  DATE = 'date',
  DATETIME = 'dateTime',
  TIME = 'time',
  HIDDEN = 'hidden',
  VEHICLETYPE = 'vehicleType',
  SUBHEADING = 'subHeading',
  FULLWIDTH = 'fullWidth'
}

export enum FormNodeTypes {
  ROOT = 'root',
  GROUP = 'group',
  CONTROL = 'control',
  ARRAY = 'array',
  SECTION = 'section',
  COMBINATION = 'combination'
}

export enum FormNodeEditTypes {
  TEXT = 'text',
  AUTOCOMPLETE = 'autocomplete',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  DATE = 'date',
  RADIO = 'radio',
  HIDDEN = 'hidden',
  CHECKBOX = 'checkbox'
}

export interface FormNodeOption<T> {
  value: T;
  label: string;
  hint?: string;
}

export interface FormNode {
  name: string;
  children?: FormNode[];
  type: FormNodeTypes; // maybe updateType?
  viewType?: FormNodeViewTypes;
  editType?: FormNodeEditTypes;
  label?: string;
  separator?: string;
  value?: any;
  path?: string;
  options?: FormNodeOption<string | number | boolean>[] | FormNodeCombinationOptions;
  validators?: { name: ValidatorNames; args?: any }[];
  disabled?: boolean;
  readonly?: boolean;
  hide?: boolean;
  required?: boolean;
  changeDetection?: ChangeDetectorRef;
  subHeadingLink?: SubHeadingLink;
  referenceData?: ReferenceDataResourceType | SpecialRefData;
}

export interface FormNodeCombinationOptions {
  leftComponentName: string;
  rightComponentName: string;
  separator: string;
}

export interface SubHeadingLink {
  label: string;
  url: string;
}

export interface CustomControl extends FormControl {
  meta: FormNode;
}

export class CustomFormControl extends FormControl implements CustomControl {
  meta: FormNode;

  constructor(
    meta: FormNode,
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
    this.meta = meta;
  }
}

interface BaseForm {
  /**
   * function that returns the json object value of the form after removing all the disabled controls
   * and properties where meta.type is not 'control', 'group' or 'array
   *
   * @returns form json value
   */
  getCleanValue: (form: CustomFormGroup | CustomFormArray) => { [key: string]: any } | Array<[]>;

  cleanValueChanges: Observable<any>;
}

export interface CustomGroup extends FormGroup {
  meta: FormNode;
}

export class CustomFormGroup extends FormGroup implements CustomGroup, BaseForm {
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

  getCleanValue = cleanValue.bind(this);

  get cleanValueChanges() {
    return this.valueChanges.pipe(map(() => this.getCleanValue(this)));
  }
}

export interface CustomArray extends FormArray {
  meta: FormNode;
}

export class CustomFormArray extends FormArray implements CustomArray, BaseForm {
  meta: FormNode;
  private dynamicFormService: DynamicFormService;

  constructor(
    meta: FormNode,
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    this.meta = meta;
    this.dynamicFormService = new DynamicFormService();
  }

  getCleanValue = cleanValue.bind(this);

  get cleanValueChanges() {
    return this.valueChanges.pipe(map(() => this.getCleanValue(this)));
  }

  addControl(data?: any): void {
    if (this.meta?.children) {
      super.push(this.dynamicFormService.createForm(this.meta.children[0], data));
    }
  }
}

const cleanValue = (form: CustomFormGroup | CustomFormArray): { [key: string]: any } | Array<[]> => {
  const cleanValue = form instanceof CustomFormArray ? [] : ({} as { [key: string]: any });
  Object.keys(form.controls).forEach(key => {
    const control = (form.controls as any)[key];
    if (control instanceof CustomFormGroup && control.meta.type === FormNodeTypes.GROUP) {
      cleanValue[key] = objectOrNull(control.getCleanValue(control));
    } else if (control instanceof CustomFormArray) {
      cleanValue[key] = control.getCleanValue(control);
    } else if (control instanceof CustomFormControl) {
      if (control.meta.type === FormNodeTypes.CONTROL && control.meta.required && control.meta.hide) {
        Array.isArray(cleanValue) ? cleanValue.push(control.meta.value || null) : (cleanValue[key] = control.meta.value || null);
      } else if (control.meta.type === FormNodeTypes.CONTROL && !control.meta.hide) {
        Array.isArray(cleanValue) ? cleanValue.push(control.value) : (cleanValue[key] = control.value);
      }
    }
  });

  return cleanValue;
};

function objectOrNull(obj: Object) {
  return Object.values(obj).some(value => undefined !== value) ? obj : null;
}
