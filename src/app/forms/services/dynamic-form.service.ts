import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { Condition } from '@forms/models/condition.model';
import { ValidatorNames } from '@forms/models/validators.enum';
import { ErrorMessageMap } from '@forms/utils/error-message-map';
import { CustomAsyncValidators } from '@forms/validators/custom-async-validators';
import { CustomValidators } from '@forms/validators/custom-validators';
import { DefectValidators } from '@forms/validators/defects/defect.validators';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes } from './dynamic-form.types';

type CustomFormFields = CustomFormControl | CustomFormArray | CustomFormGroup;

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private store: Store<State>) {}

  validatorMap: Record<ValidatorNames, (args: any) => ValidatorFn> = {
    [ValidatorNames.AheadOfDate]: (arg: string) => CustomValidators.aheadOfDate(arg),
    [ValidatorNames.Alphanumeric]: () => CustomValidators.alphanumeric(),
    [ValidatorNames.CopyValueToRootControl]: (arg: string) => CustomValidators.copyValueToRootControl(arg),
    [ValidatorNames.CustomPattern]: (args: string[]) => CustomValidators.customPattern([...args]),
    [ValidatorNames.DateNotExceed]: (args: { sibling: string; months: number }) => CustomValidators.dateNotExceed(args.sibling, args.months),
    [ValidatorNames.Defined]: () => CustomValidators.defined(),
    [ValidatorNames.DisableIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.disableIfEquals(args.sibling, args.value),
    [ValidatorNames.EnableIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.enableIfEquals(args.sibling, args.value),
    [ValidatorNames.FutureDate]: () => CustomValidators.futureDate,
    [ValidatorNames.HideIfEmpty]: (args: string) => CustomValidators.hideIfEmpty(args),
    [ValidatorNames.HideIfNotEqual]: (args: { sibling: string; value: any }) => CustomValidators.hideIfNotEqual(args.sibling, args.value),
    [ValidatorNames.HideIfParentSiblingEqual]: (args: { sibling: string; value: any }) =>
      CustomValidators.hideIfParentSiblingEquals(args.sibling, args.value),
    [ValidatorNames.HideIfParentSiblingNotEqual]: (args: { sibling: string; value: any }) =>
      CustomValidators.hideIfParentSiblingNotEqual(args.sibling, args.value),
    [ValidatorNames.Max]: (args: number) => Validators.max(args),
    [ValidatorNames.MaxLength]: (args: number) => Validators.maxLength(args),
    [ValidatorNames.Min]: (args: number) => Validators.min(args),
    [ValidatorNames.MinLength]: (args: number) => Validators.minLength(args),
    [ValidatorNames.NotZNumber]: () => CustomValidators.notZNumber,
    [ValidatorNames.Numeric]: () => CustomValidators.numeric(),
    [ValidatorNames.PastDate]: () => CustomValidators.pastDate,
    [ValidatorNames.Pattern]: (args: string) => Validators.pattern(args),
    [ValidatorNames.Required]: () => Validators.required,
    [ValidatorNames.RequiredIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.requiredIfEquals(args.sibling, args.value),
    [ValidatorNames.RequiredIfNotEquals]: (args: { sibling: string; value: any }) => CustomValidators.requiredIfNotEqual(args.sibling, args.value),
    [ValidatorNames.ValidateDefectNotes]: () => DefectValidators.validateDefectNotes,
    [ValidatorNames.ValidateProhibitionIssued]: () => DefectValidators.validateProhibitionIssued
  };

  asyncValidatorMap: Record<AsyncValidatorNames, (args: any) => AsyncValidatorFn> = {
    [AsyncValidatorNames.HideIfEqualsWithCondition]: (args: { sibling: string; value: string; conditions: Condition | Condition[] }) =>
      CustomAsyncValidators.hideIfEqualsWithCondition(this.store, args.sibling, args.value, args.conditions),
    [AsyncValidatorNames.PassResultDependantOnCustomDefects]: () => CustomAsyncValidators.passResultDependantOnCustomDefects(this.store),
    [AsyncValidatorNames.RequiredIfNotAbandoned]: () => CustomAsyncValidators.requiredIfNotAbandoned(this.store),
    [AsyncValidatorNames.RequiredIfNotFail]: () => CustomAsyncValidators.requiredIfNotFail(this.store),
    [AsyncValidatorNames.RequiredIfNotResult]: (args: { testResult: any }) => CustomAsyncValidators.requiredIfNotResult(this.store, args.testResult),
    [AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals]: (args: { testResult: any; sibling: string; value: any }) =>
      CustomAsyncValidators.requiredIfNotResultAndSiblingEquals(this.store, args.testResult, args.sibling, args.value),
    [AsyncValidatorNames.ResultDependantOnCustomDefects]: () => CustomAsyncValidators.resultDependantOnCustomDefects(this.store),
    [AsyncValidatorNames.UpdateTesterDetails]: () => CustomAsyncValidators.updateTesterDetails(this.store),
    [AsyncValidatorNames.UpdateTestStationDetails]: () => CustomAsyncValidators.updateTestStationDetails(this.store)
  };

  createForm(formNode: FormNode, data?: any): CustomFormGroup | CustomFormArray {
    if (!formNode) {
      return new CustomFormGroup(formNode, {});
    }

    const form: CustomFormGroup | CustomFormArray =
      formNode.type === FormNodeTypes.ARRAY ? new CustomFormArray(formNode, [], this.store) : new CustomFormGroup(formNode, {});
    data = data ?? (formNode.type === FormNodeTypes.ARRAY ? [] : {});

    formNode.children?.forEach(child => {
      const { name, type, value, validators, asyncValidators, disabled } = child;

      const control =
        FormNodeTypes.CONTROL === type ? new CustomFormControl({ ...child }, { value, disabled: !!disabled }) : this.createForm(child, data[name]);

      if (validators?.length) {
        this.addValidators(control, validators);
      }

      if (asyncValidators?.length) {
        this.addAsyncValidators(control, asyncValidators);
      }

      if (form instanceof FormGroup) {
        form.addControl(name, control);
      } else if (form instanceof FormArray) {
        this.createControls(child, data).forEach(element => form.push(element));
      }
    });

    if (data) {
      form.patchValue(data);
    }

    return form;
  }

  createControls(child: FormNode, data: any): CustomFormFields[] {
    // Note: There's a quirk here when dealing with arrays where if
    // `data` is an array then `child.name` should be a correct index so
    // make sure the template has the correct name to the node.
    return Array.isArray(data)
      ? data.map(() =>
          FormNodeTypes.CONTROL !== child.type
            ? this.createForm(child, data[Number(child.name)])
            : new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled })
        )
      : [new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled })];
  }

  addValidators(control: CustomFormFields, validators: Array<{ name: ValidatorNames; args?: any }> = []) {
    validators.forEach(v => control.addValidators(this.validatorMap[v.name](v.args)));
  }

  addAsyncValidators(control: CustomFormFields, validators: Array<{ name: AsyncValidatorNames; args?: any }> = []) {
    validators.forEach(v => control.addAsyncValidators(this.asyncValidatorMap[v.name](v.args)));
  }

  static updateValidity(form: FormGroup | FormArray, errors: GlobalError[]) {
    Object.entries(form.controls).forEach(([, value]) => {
      if (!(value instanceof CustomFormControl)) {
        this.updateValidity(value as CustomFormGroup | CustomFormArray, errors);
      } else {
        value.markAsTouched();
        value.updateValueAndValidity({ emitEvent: false });
        value.meta.changeDetection?.detectChanges();
        this.getControlErrors(value, errors);
      }
    });
  }

  private static getControlErrors(control: CustomFormControl | FormControl, validationErrorList: GlobalError[]) {
    const { errors } = control;

    const meta = (control as CustomFormControl).meta as FormNode | undefined;

    if (errors) {
      const errorList = Object.keys(errors);

      errorList.forEach(error => {
        validationErrorList.push({
          error: ErrorMessageMap[error](errors[error], meta?.customValidatorErrorName ?? meta?.label),
          anchorLink: meta?.name
        } as GlobalError);
      });
    }
  }
}
