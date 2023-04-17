import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { Roles } from '@models/roles.enum';

@Component({
  selector: 'app-reference-data',
  templateUrl: './reference-data.component.html'
})
export class ReferenceDataComponent {
  store: any;
  form: CustomFormGroup;
  references: Array<FormNodeOption<string>> = [{ label: 'Country of registration', value: 'CountryOfRegistration' }];
  errorService: any;

  constructor(public globalErrorService: GlobalErrorService, private route: ActivatedRoute, private router: Router) {
    this.form = new CustomFormGroup(
      { name: 'reference-data', type: FormNodeTypes.GROUP },
      {
        reference: new CustomFormControl({ name: 'reference', label: 'Reference Data type', type: FormNodeTypes.CONTROL }, undefined, [
          Validators.required
        ])
      }
    );
  }

  public get roles() {
    return Roles;
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    this.globalErrorService.setErrors(errors);

    return this.form.valid;
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  handleSubmit(): void {
    if (!this.isFormValid) {
      return;
    }

    this.router.navigate(['../reference-data/data-type-list'], { relativeTo: this.route });
  }

  cancel() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
