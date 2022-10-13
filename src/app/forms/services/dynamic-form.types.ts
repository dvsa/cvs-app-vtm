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
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { map, Observable } from 'rxjs';
import { DynamicFormService } from './dynamic-form.service';
import { SpecialRefData } from './multi-options.service';

export enum FormNodeViewTypes {
  DATE = 'date',
  DATETIME = 'dateTime',
  FULLWIDTH = 'fullWidth',
  HIDDEN = 'hidden',
  STRING = 'string',
  SUBHEADING = 'subHeading',
  TIME = 'time',
  VEHICLETYPE = 'vehicleType'
}

export enum FormNodeTypes {
  ARRAY = 'array',
  COMBINATION = 'combination',
  CONTROL = 'control',
  DIMENSIONS = 'dimensions',
  GROUP = 'group',
  ROOT = 'root',
  SECTION = 'section'
}

export enum FormNodeEditTypes {
  AUTOCOMPLETE = 'autocomplete',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  DATETIME = 'datetime',
  DROPDOWN = 'dropdown',
  HIDDEN = 'hidden',
  NUMBER = 'number',
  NUMERICSTRING = 'numericstring',
  RADIO = 'radio',
  SELECT = 'select',
  TEXT = 'text',
  TEXTAREA = 'textarea'
}

export enum FormNodeWidth {
  XXL = 30,
  XL = 20,
  L = 10,
  M = 5,
  S = 4,
  XS = 3,
  XXS = 2
}

export interface FormNodeOption<T> {
  value: T;
  label: string;
  hint?: string;
}

type AsyncValidatorOptions = AsyncValidatorFn | AsyncValidatorFn[] | null;

export interface FormNode {
  name: string;
  children?: FormNode[];
  type: FormNodeTypes; // maybe updateType?
  viewType?: FormNodeViewTypes;
  editType?: FormNodeEditTypes;
  width?: FormNodeWidth;
  label?: string;
  delimited?: { regex?: string; separator: string };
  value?: any;
  path?: string;
  options?: FormNodeOption<string | number | boolean | null>[] | FormNodeCombinationOptions;
  validators?: { name: ValidatorNames; args?: any }[];
  customValidatorErrorName?: string;
  asyncValidators?: { name: AsyncValidatorNames; args?: any }[];
  disabled?: boolean;
  readonly?: boolean;
  hide?: boolean;
  required?: boolean;
  changeDetection?: ChangeDetectorRef;
  subHeadingLink?: SubHeadingLink;
  referenceData?: ReferenceDataResourceType | SpecialRefData;
  suffix?: string;
  isoDate?: boolean;
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
    asyncValidator?: AsyncValidatorOptions
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
    asyncValidator?: AsyncValidatorOptions
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
    store: Store<State>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorOptions
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    this.meta = meta;
    this.dynamicFormService = new DynamicFormService(store);
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

const cleanValue = (form: CustomFormGroup | CustomFormArray): Record<string, any> | Array<[]> => {
  const cleanValue = form instanceof CustomFormArray ? [] : ({} as Record<string, any>);
  Object.keys(form.controls).forEach(key => {
    const control = (form.controls as any)[key];
    if (control instanceof CustomFormGroup && control.meta.type === FormNodeTypes.GROUP) {
      cleanValue[key] = objectOrNull(control.getCleanValue(control));
    } else if (control instanceof CustomFormArray) {
      cleanValue[key] = control.getCleanValue(control);
    } else if (control instanceof CustomFormControl && control.meta.type === FormNodeTypes.CONTROL) {
      if (control.meta.required && control.meta.hide) {
        pushOrAssignAt(control.meta.value || null, cleanValue, key);
      } else if (!control.meta.hide) {
        pushOrAssignAt(control.value, cleanValue, key);
      }
    }
  });

  return cleanValue;
};

function objectOrNull(obj: Object) {
  return Object.values(obj).some(value => undefined !== value) ? obj : null;
}

function pushOrAssignAt(value: any, cleanValue: Array<[]> | Record<string, any>, key: string) {
  if (Array.isArray(cleanValue)) {
    cleanValue.push(value);
  } else cleanValue[key] = value;
}
