import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ErrorMessageMap } from '@forms/utils/error-message-map';
import { CustomValidators } from '@forms/validators/custom-validators';
import { CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes } from './dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';
import { DefectValidators } from '@forms/validators/defects/defect.validators';
import { Store } from '@ngrx/store';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { CustomAsyncValidators } from '@forms/validators/custom-async-validators';
import { State } from '@store/.';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private store: Store<State>) {}

  validatorMap: Record<ValidatorNames, (args: any) => ValidatorFn> = {
    [ValidatorNames.CustomPattern]: (args: string[]) => CustomValidators.customPattern([...args]),
    [ValidatorNames.DisableIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.disableIfEquals(args.sibling, args.value),
    [ValidatorNames.EnableIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.enableIfEquals(args.sibling, args.value),
    [ValidatorNames.HideIfEmpty]: (args: string) => CustomValidators.hideIfEmpty(args),
    [ValidatorNames.HideIfNotEqual]: (args: { sibling: string; value: any }) => CustomValidators.hideIfNotEqual(args.sibling, args.value),
    [ValidatorNames.HideIfParentSiblingEqual]: (args: { sibling: string; value: any }) =>
      CustomValidators.hideIfParentSiblingEquals(args.sibling, args.value),
    [ValidatorNames.HideIfParentSiblingNotEqual]: (args: { sibling: string; value: any }) =>
      CustomValidators.hideIfParentSiblingNotEqual(args.sibling, args.value),
    [ValidatorNames.MaxLength]: (args: number) => Validators.maxLength(args),
    [ValidatorNames.MinLength]: (args: number) => Validators.minLength(args),
    [ValidatorNames.Max]: (args: number) => Validators.max(args),
    [ValidatorNames.Min]: (args: number) => Validators.min(args),
    [ValidatorNames.Numeric]: () => CustomValidators.numeric(),
    [ValidatorNames.Pattern]: (args: string) => Validators.pattern(args),
    [ValidatorNames.Required]: () => Validators.required,
    [ValidatorNames.RequiredIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.requiredIfEquals(args.sibling, args.value),
    [ValidatorNames.RequiredIfNotEquals]: (args: { sibling: string; value: any }) => CustomValidators.requiredIfNotEqual(args.sibling, args.value),
    [ValidatorNames.ValidateDefectNotes]: () => DefectValidators.validateDefectNotes
  };

  asyncValidatorMap: Record<AsyncValidatorNames, (args: any) => AsyncValidatorFn> = {
    [AsyncValidatorNames.ResultDependantOnCustomDefects]: () => CustomAsyncValidators.resultDependantOnCustomDefects(this.store),
    [AsyncValidatorNames.UpdateTestStationDetails]: () => CustomAsyncValidators.updateTestStationDetails(this.store),
    [AsyncValidatorNames.UpdateTesterDetails]: () => CustomAsyncValidators.updateTesterDetails(this.store)
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

      if (validators && validators.length > 0) {
        this.addValidators(control, validators);
      }

      if (asyncValidators && asyncValidators.length > 0) {
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

  createControls(child: FormNode, data: any): (CustomFormGroup | CustomFormArray | CustomFormControl)[] {
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

  addValidators(control: CustomFormGroup | CustomFormArray | CustomFormControl, validators: Array<{ name: ValidatorNames; args?: any }> = []) {
    validators.forEach(v => control.addValidators(this.validatorMap[v.name](v.args)));
  }

  addAsyncValidators(
    control: CustomFormGroup | CustomFormArray | CustomFormControl,
    validators: Array<{ name: AsyncValidatorNames; args?: any }> = []
  ) {
    validators.forEach(v => control.addAsyncValidators(this.asyncValidatorMap[v.name](v.args)));
  }

  static updateValidity(form: CustomFormGroup | CustomFormArray, errors: GlobalError[]) {
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

  private static getControlErrors(control: CustomFormControl, validationErrorList: GlobalError[]) {
    const {
      errors,
      meta: { name, label }
    } = control;

    if (errors) {
      const errorList = Object.keys(errors);

      errorList.forEach(error => {
        validationErrorList.push({ error: ErrorMessageMap[error](errors[error], label), anchorLink: name } as GlobalError);
      });
    }
  }
}
