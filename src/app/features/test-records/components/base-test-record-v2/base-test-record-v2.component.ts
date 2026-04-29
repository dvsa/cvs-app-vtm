import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';

@Component({
  selector: 'app-base-test-record-v2',
  template: '',
  providers: [FormsModule, ReactiveFormsModule]
})
export class BaseTestRecordV2Component {
  controlContainer = inject(ControlContainer);
  fb = inject(FormBuilder);
  testRecordService = inject(TestRecordsService);
  commonValidators = inject(CommonValidatorsService);

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
