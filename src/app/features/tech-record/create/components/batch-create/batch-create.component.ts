import { Component } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
@Component({
  selector: 'app-batch-create',
  templateUrl: './batch-create.component.html'
})
export class BatchCreateComponent {
  constructor(private formBuilder: FormBuilder, private globalErrorService: GlobalErrorService) {}
  private numberOfFields = 40;

  private startingObject = { vin: '' };

  form = this.formBuilder.group({
    'input-data': this.formBuilder.array(this.getNumberOfFields(this.numberOfFields).map(() => this.formBuilder.group(this.startingObject)))
  });

  getNumberOfFields(qty: number) {
    return Array.from(Array(qty));
  }

  get inputDataArray() {
    return this.form.get('input-data') as FormArray;
  }

  get filledVinsInForm(): typeof this.startingObject[] {
    return this.inputDataArray.value ?? [];
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];
    DynamicFormService.updateValidity(this.form, errors);
    this.globalErrorService.setErrors(errors);
    return this.form.valid;
  }

  private cleanEmptyValues<T extends Record<string, any>>(input: T[]): T[] {
    return input.filter(formInput => Object.values(formInput).some(value => !!value));
  }

  handleSubmit() {
    if (!this.isFormValid) return;
    console.log(this.cleanEmptyValues(this.filledVinsInForm));
  }
}
