import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFormControl, FormNodeEditTypes } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html'
})
export class DynamicFormFieldComponent {
  @Input() control?: KeyValue<string, CustomFormControl>;
  @Input() form?: FormGroup;
  constructor() {}

  get formNodeEditTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get options(): any[] {
    return this.control?.value.meta.options as any[];
  }
}
