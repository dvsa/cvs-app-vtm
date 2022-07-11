import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ErrorMessageMap } from '@forms/utils/error-message-map';
import { CustomValidators } from '@forms/validators/custom-validators';
import { CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes } from './dynamic-form.types';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor() {}

  validatorMap: { [key: string]: (args: any) => ValidatorFn } = {
    required: () => Validators.required,
    hideIfEmpty: (args: string) => CustomValidators.hideIfEmpty(args),
    pattern: (args: string) => Validators.pattern(args),
    customPattern: (args: string[]) => CustomValidators.customPattern([...args]),
    numeric: () => CustomValidators.numeric(),
    maxLength: (args: number) => Validators.maxLength(args),
    minLength: (args: number) => Validators.minLength(args)
  };

  createForm(formNode: FormNode, data?: any): CustomFormGroup | CustomFormArray {
    if (!formNode) {
      return new CustomFormGroup(formNode, {});
    }

    const form: CustomFormGroup | CustomFormArray = formNode.type === FormNodeTypes.ARRAY ? new CustomFormArray(formNode, []) : new CustomFormGroup(formNode, {});
    data = data ?? (formNode.type === FormNodeTypes.ARRAY ? [] : {});

    formNode.children?.forEach(child => {
      const { name, type, value, validators, disabled } = child;

      const control = FormNodeTypes.CONTROL === type
        ? new CustomFormControl({ ...child }, { value, disabled: !!disabled })
        : this.createForm(child, data[name]);

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
    // `d` is a array then `child.name` should be a correct index so
    // make sure the template has the correct name to the node.
    return Array.isArray(data)
      ? data.map(
          () => FormNodeTypes.CONTROL !== child.type
            ? this.createForm(child, data[Number(child.name)])
            : new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled })
          )
      : [new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled })]
  }

  addValidators(control: CustomFormGroup | CustomFormArray | CustomFormControl, validators: Array<{ name: string; args?: any }> = []) {
    validators.forEach(v => control.addValidators(this.validatorMap[v.name](v.args)));
  }

  static updateValidity(form: CustomFormGroup | CustomFormArray): GlobalError[] {
    const valildationErrors: GlobalError[] = [];

    Object.entries(form.controls).forEach(([key, value]) => {
      this.validate(value, valildationErrors);
    });

    return valildationErrors;
  }

  static validate(control: CustomFormGroup | CustomFormArray | CustomFormControl | AbstractControl, validationErrorList: GlobalError[]) {
    if (control instanceof CustomFormGroup) {
      this.updateValidity(control);
    } else if (control instanceof CustomFormArray) {
      control.controls.forEach((i) => {
        this.validate(i, validationErrorList);
      });
    } else {
      control.markAsTouched();
      control.updateValueAndValidity({ emitEvent: true });
      (control as CustomFormControl).meta.changeDetection?.detectChanges();
      this.getControlErrors(control as CustomFormControl, validationErrorList);
    }
  }

  private static getControlErrors(control: CustomFormControl, validationErrorList: GlobalError[]) {
    const {
      errors,
      meta: { name, label }
    } = control;

    if (errors) {
      const errorList = Object.keys(errors);
      errorList.forEach((error) => {
        validationErrorList.push({ error: ErrorMessageMap[error](errors[error], label), anchorLink: name } as GlobalError);
      });
    }
  }
}
