import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, NgControl } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { CustomControl } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-custom-control-component',
  template: '',
})
export class CustomControlComponentComponent extends BaseControlComponent {
  protected form?: FormGroup;

  override ngAfterContentInit(): void {
    const injectedControl = this.injector.get(NgControl, null);
    if (injectedControl) {
      const ngControl = injectedControl.control as unknown as KeyValue<string, CustomControl>;
      if (ngControl.value) {
        this.name = ngControl.key;
        this.control = ngControl.value;
        this.form = this.injector.get(FORM_INJECTION_TOKEN) as FormGroup;
      }
    }
  }
}
