import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { Roles } from '@models/roles.enum';

@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html'
})
export class AddReferenceDataComponent implements OnInit {
  form!: CustomFormGroup;

  constructor(public globalErrorService: GlobalErrorService, private route: ActivatedRoute, private router: Router) {
    this.form = new CustomFormGroup(
      { name: 'main-form', type: FormNodeTypes.GROUP },
      {
        resourceKey: new CustomFormControl(
          {
            name: 'resource-key',
            label: 'resource-key',
            type: FormNodeTypes.CONTROL
          },
          '',
          [Validators.required]
        ),
        description: new CustomFormControl(
          {
            name: 'description',
            label: 'description',
            type: FormNodeTypes.CONTROL
          },
          '',
          [Validators.required]
        )
      }
    );
  }

  ngOnInit(): void {}

  // handleSubmit(): void {
  //     this.router.navigate(['../reference-data/data-type-list'], { relativeTo: this.route });

  // }

  ngOnChanges(): void {}

  get roles() {
    return Roles;
  }

  back() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
