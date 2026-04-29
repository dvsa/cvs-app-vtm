import { Component, inject } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-test-record-v2',
  template: '',
})
export class BaseTestRecordV2Component {
  controlContainer = inject(ControlContainer);
  fb = inject(FormBuilder);

  get parent() {
    return this.controlContainer.control as FormGroup;
  }

  init(form: FormGroup) {
    const parent = this.controlContainer.control;
    if (parent instanceof FormGroup) {
      Object.entries(form.controls).forEach(([key, control]) => parent.addControl(key, control, { emitEvent: false }));
    }
  }

  destroy(form: FormGroup) {
    const parent = this.controlContainer.control;
    if (parent instanceof FormGroup) {
      Object.keys(form.controls).forEach((key) => parent.removeControl(key, { emitEvent: false }));
    }
  }

  addControls(controls: Record<string, AbstractControl>, form: FormGroup) {
    for (const [key, control] of Object.entries(controls ?? {})) {
      form.addControl(key, control, { emitEvent: false });
    }
  }

}
