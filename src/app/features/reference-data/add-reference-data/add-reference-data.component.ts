import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { take } from 'rxjs';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { Roles } from '@models/roles.enum';
import { ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html'
})
export class AddReferenceDataComponent implements OnInit {
  private resourceType: ReferenceDataResourceType = ReferenceDataResourceType.ReferenceDataAdminType;
  form?: CustomFormGroup;

  columns: string[] = ['resource-key', 'description'];

  constructor(
    private referenceDataService: ReferenceDataService,
    public globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {
    this.store
      .pipe(select(selectReferenceDataByResourceKey(this.resourceType, ReferenceDataResourceType.CountryOfRegistration)), take(1))
      .subscribe(referenceData => {
        if (!referenceData) return;

        const controls = Object.assign(
          {},
          ...Object.keys(referenceData)
            .filter(property => property !== 'resourceType')
            .map(property => ({
              [property]: new CustomFormControl(
                {
                  name: property,
                  label: property,
                  type: FormNodeTypes.CONTROL,
                  editType: (referenceData as any)[property]
                },
                '',
                [Validators.required]
              )
            }))
        );

        this.form = new CustomFormGroup({ name: 'form', type: FormNodeTypes.GROUP }, controls);
      });
  }

  ngOnInit(): void {
    this.referenceDataService.loadReferenceData(this.resourceType);
  }

  get roles() {
    return Roles;
  }

  get isFormValid(): boolean {
    if (!this.form) return false;

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
    if (!this.isFormValid) return;
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getLabel(rawString: string): string {
    const splitString: string = rawString.replace(/([a-z])([A-Z])/g, '$1 $2');
    const newString = splitString.charAt(0).toUpperCase() + splitString.slice(1);
    return newString;
  }
}
