import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { Observable } from 'rxjs';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { Roles } from '@models/roles.enum';
import { selectAllReferenceDataByResourceType } from '@store/reference-data';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html'
})
export class AddReferenceDataComponent implements OnInit {
  private resourceType: ReferenceDataResourceType = ReferenceDataResourceType.ReferenceDataAdminType;
  form: CustomFormGroup;
  store: any;
  columns: string[] = ['Resource Key', 'Description'];

  constructor(
    private referenceDataService: ReferenceDataService,
    public globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = new CustomFormGroup(
      { name: 'main-form', type: FormNodeTypes.GROUP },
      {
        resourceKey: new CustomFormControl(
          {
            name: 'resource-key',
            label: 'Resource Key',
            type: FormNodeTypes.CONTROL
          },
          '',
          [Validators.required]
        ),
        description: new CustomFormControl(
          {
            name: 'description',
            label: 'Description',
            type: FormNodeTypes.CONTROL
          },
          '',
          [Validators.required]
        )
      }
    );
  }

  ngOnInit(): void {
    this.referenceDataService.loadReferenceData(this.resourceType);
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  get referenceData$(): Observable<ReferenceDataModelBase[] | undefined> {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(this.resourceType)));
  }

  get roles() {
    return Roles;
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];
    DynamicFormService.validate(this.form, errors);
    this.globalErrorService.setErrors(errors);
    return this.form.valid;
  }

  handleBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  handleSubmit() {
    if (!this.isFormValid) {
      return;
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
