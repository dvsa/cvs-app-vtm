import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
@Component({
  selector: 'app-batch-create',
  templateUrl: './batch-create.component.html',
  styleUrls: ['./batch-create.component.scss']
})
export class BatchCreateComponent {
  constructor(private formBuilder: FormBuilder, private globalErrorService: GlobalErrorService) {}

  private startingObject = { vin: '' };

  form = this.formBuilder.group({
    'input-data': this.formBuilder.array(this.getNumberOfFields().map(_ => this.formBuilder.group(this.startingObject)))
  });

  getNumberOfFields(qty: number = 40) {
    return Array.from(Array(qty));
  }

  get inputDataArray() {
    return this.form.get('input-data') as FormArray;
  }

  get filledVinsInForm(): string[] {
    return this.form.value;
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];
    DynamicFormService.updateValidity(this.form, errors);
    this.globalErrorService.setErrors(errors);
    return this.form.valid;
  }

  handleSubmit() {
    if (!this.isFormValid) return;
    console.log(this.filledVinsInForm);
  }
}
