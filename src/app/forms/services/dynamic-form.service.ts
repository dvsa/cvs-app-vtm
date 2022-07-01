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

  createForm(f: FormNode, d?: any): CustomFormGroup | CustomFormArray {
    if (!f) {
      return new CustomFormGroup(f, {});
    }

    const formType = f.type;
    let form: CustomFormGroup | CustomFormArray = FormNodeTypes.ARRAY === formType ? new CustomFormArray(f, []) : new CustomFormGroup(f, {});
    d = d ?? (FormNodeTypes.ARRAY === formType ? [] : {});

    f?.children?.forEach((child) => {
      const { name, type, value, validators, disabled } = child;
      let control;

      if (FormNodeTypes.CONTROL !== type) {
        control = this.createForm(child, d[name]);
      } else {
        control = new CustomFormControl({ ...child }, { value, disabled: !!disabled });
      }

      if (validators && validators.length > 0) {
        this.addValidators(control, validators);
      }

      if (form instanceof FormGroup) {
        form.addControl(name, control);
      } else if (form instanceof FormArray) {
        this.createControls(child, d).forEach((element) => {
          (form as FormArray).push(element);
        });
      }
    });

    if (d) {
      form.patchValue(d);
    }

    return form;
  }

  createControls(child: FormNode, d: any) {
    const controls: any[] = [];
    if (d.length && d.length > 0) {
      d.forEach(() => {
        if (FormNodeTypes.CONTROL !== child.type) {
          // Note: There's a quirk here when dealing with arrays where if
          // `d` is a array then `child.name` should be a correct index so
          // make sure the template has the correct name to the node.
          controls.push(this.createForm(child, d[child.name]));
        } else {
          controls.push(new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled }));
        }
      });
    } else {
      controls.push(new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled }));
    }
    return controls;
  }

  addValidators(control: CustomFormGroup | CustomFormArray | CustomFormControl, validators: Array<{ name: string; args?: any }> = []) {
    validators.forEach((v) => {
      control.addValidators(this.validatorMap[v.name](v.args));
    });
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

    // const valildationErrors: GlobalError[] = [];

    if (errors) {
      const errorList = Object.keys(errors);
      errorList.forEach((error) => {
        validationErrorList.push({ error: ErrorMessageMap[error](errors[error], label), anchorLink: name } as GlobalError);
      });
    }

    // return valildationErrors;
  }
}
