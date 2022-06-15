import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFormControl, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.scss']
})
export class DynamicFormFieldComponent {
  @Input() control?: KeyValue<string, CustomFormControl>;
  @Input() form: FormGroup = {} as FormGroup;
  constructor() { }



  get formNodeEditTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get options(): string[] {
    return (this.control?.value.meta.options as string[]) || [];
  }

}
