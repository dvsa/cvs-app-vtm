import { Injectable } from '@angular/core';
import { FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ErrorMessageMap } from '@forms/utils/error-message-map';
import { CustomValidators } from '@forms/validators/custom-validators';
import { CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes } from './dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';
import { DefectValidators } from '@forms/validators/defects/defect.validators';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor() {}

  validatorMap: Record<ValidatorNames, (args: any) => ValidatorFn> = {
    [ValidatorNames.Required]: () => Validators.required,
    [ValidatorNames.Pattern]: (args: string) => Validators.pattern(args),
    [ValidatorNames.CustomPattern]: (args: string[]) => CustomValidators.customPattern([...args]),
    [ValidatorNames.Numeric]: () => CustomValidators.numeric(),
    [ValidatorNames.MaxLength]: (args: number) => Validators.maxLength(args),
    [ValidatorNames.MinLength]: (args: number) => Validators.minLength(args),
    [ValidatorNames.HideIfEmpty]: (args: string) => CustomValidators.hideIfEmpty(args),
    [ValidatorNames.RequiredIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.requiredIfEquals(args.sibling, args.value),
    [ValidatorNames.RequiredIfNotEquals]: (args: { sibling: string; value: any }) => CustomValidators.requiredIfNotEqual(args.sibling, args.value),
    [ValidatorNames.ValidateDefectNotes]: () => DefectValidators.validateDefectNotes,
    [ValidatorNames.enableIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.enableIfEquals(args.sibling, args.value),
    [ValidatorNames.disableIfEquals]: (args: { sibling: string; value: any }) => CustomValidators.disableIfEquals(args.sibling, args.value),
    [ValidatorNames.HideIfNotEqual]: (args: { sibling: string; value: any }) => CustomValidators.hideIfNotEqual(args.sibling, args.value),
    [ValidatorNames.HideIfParentSiblingNotEqual]: (args: { sibling: string; value: any }) =>
      CustomValidators.hideIfParentSiblingNotEqual(args.sibling, args.value),
    [ValidatorNames.HideIfParentSiblingEqual]: (args: { sibling: string; value: any }) =>
      CustomValidators.hideIfParentSiblingEquals(args.sibling, args.value),
    [ValidatorNames.ValidateDefectNotes]: () => DefectValidators.validateDefectNotes
  };

  createForm(formNode: FormNode, data?: any): CustomFormGroup | CustomFormArray {
    if (!formNode) {
      return new CustomFormGroup(formNode, {});
    }

    const form: CustomFormGroup | CustomFormArray =
      formNode.type === FormNodeTypes.ARRAY ? new CustomFormArray(formNode, []) : new CustomFormGroup(formNode, {});
    data = data ?? (formNode.type === FormNodeTypes.ARRAY ? [] : {});

    formNode.children?.forEach(child => {
      const { name, type, value, validators, disabled } = child;

      const control =
        FormNodeTypes.CONTROL === type ? new CustomFormControl({ ...child }, { value, disabled: !!disabled }) : this.createForm(child, data[name]);

      if (validators && validators.length > 0) {
        this.addValidators(control, validators);
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

  static updateValidity(form: CustomFormGroup | CustomFormArray, errors: GlobalError[]) {
    Object.entries(form.controls).forEach(([key, value]) => {
      if (!(value instanceof CustomFormControl)) {
        this.updateValidity(value as CustomFormGroup | CustomFormArray, errors);
      } else {
        value.markAsTouched();
        value.updateValueAndValidity({ emitEvent: false });
        (value as CustomFormControl).meta.changeDetection?.detectChanges();
        this.getControlErrors(value as CustomFormControl, errors);
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
