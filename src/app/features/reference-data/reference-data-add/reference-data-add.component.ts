import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import { switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-reference-data-add',
  templateUrl: './reference-data-add.component.html'
})
export class AddReferenceDataComponent {
  type: ReferenceDataResourceType = ReferenceDataResourceType.Brakes;

  form: CustomFormGroup = new CustomFormGroup(
    { name: 'form', type: FormNodeTypes.GROUP },
    {
      resourceKey: new CustomFormControl({
        name: 'resourceKey',
        label: 'Resource Key',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.TEXT
      })
    }
  );

  constructor(
    public globalErrorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {
    this.referenceDataService.loadReferenceData(ReferenceDataResourceType.ReferenceDataAdminType);

    this.route.queryParams
      .pipe(
        take(1),
        tap(params => (this.type = params['type'])),
        switchMap(params => this.store.select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, params['type'])))
      )
      .subscribe(referenceData => {
        if (!referenceData) return;

        Object.keys(referenceData)
          .filter(property => property !== 'resourceType' && property !== 'resourceKey')
          .forEach(property =>
            this.form.addControl(
              property,
              new CustomFormControl(
                {
                  name: property,
                  label: property,
                  type: FormNodeTypes.CONTROL,
                  editType: (referenceData as any)[property]
                },
                '',
                [Validators.required]
              )
            )
          );
      });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get isFormValid(): boolean {
    if (!this.form) return false;

    const errors: GlobalError[] = [];
    DynamicFormService.validate(this.form, errors);
    this.globalErrorService.setErrors(errors);
    return this.form.valid;
  }

  titleCaseHeading(input: ReferenceDataResourceType): string {
    return this.referenceDataService.macroCasetoTitleCase(input);
  }

  titleCaseField(s: string): string {
    return this.referenceDataService.camelCaseToTitleCase(s);
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  handleSubmit() {
    if (!this.isFormValid) return;

    const referenceData: ReferenceDataModelBase = {
      resourceType: this.type,
      resourceKey: this.form.get('resourceKey')?.value
    };

    Object.keys(this.form.controls).forEach(control => (referenceData[control as keyof ReferenceDataModelBase] = this.form.get(control)?.value));

    this.referenceDataService.createNewReferenceDataItem(this.type, referenceData).subscribe(() => this.navigateBack());
  }
}