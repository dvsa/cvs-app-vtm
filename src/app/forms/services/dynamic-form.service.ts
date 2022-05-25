import { Injectable } from '@angular/core';
import { FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CustomValidator } from '@forms/validators/custom-validators';
import { FormNode, CustomFormGroup, CustomFormControl, CustomFormArray, FormNodeTypes } from './dynamic-form.types';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor() {}

  validatorMap: { [key: string]: any } = {
    required: () => Validators.required,
    hide: (args: string) => CustomValidator.hide(args)
  };

  createForm(f: FormNode, d: any = {}): CustomFormGroup | CustomFormArray {
    if (!f) {
      return new CustomFormGroup(f, {});
    }

    const formType = f.type;
    let form: CustomFormGroup | CustomFormArray = FormNodeTypes.ARRAY === formType ? new CustomFormArray(f, []) : new CustomFormGroup(f, {});

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

  addValidators(control: CustomFormGroup | CustomFormArray | CustomFormControl, validators: Array<{ name: string; args?: any[] }> = []) {
    validators.forEach((v) => {
      control.addValidators(this.validatorMap[v.name](v.args));
    });
  }
}
