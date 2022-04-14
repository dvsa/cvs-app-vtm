import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormNode } from '../components/dynamic-form-group/dynamic-form-group.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor() {}

  validatorMap: { [key: string]: ValidatorFn } = {
    required: Validators.required
  };

  createForm(f: FormNode): FormGroup {
    let form: FormGroup = new FormGroup({});

    f.children.forEach((child) => {
      const { name, type, value } = child;
      let control;
      if ('group' === type) {
        control = this.createForm(child);
      } else {
        control = new FormControl(value);
      }
      if (!control) {
        throw new Error('invalid control type');
      }

      form.addControl(name, control);
    });

    return form;
  }

  addValidators(control: FormControl, validators: Array<string> = []) {
    validators.forEach((v: string) => {
      control.addValidators(this.validatorMap[v]);
    });
  }
}
