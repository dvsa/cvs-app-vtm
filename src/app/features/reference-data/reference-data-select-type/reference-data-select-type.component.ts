import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, selectAllReferenceDataByResourceType } from '@store/reference-data';
import { Observable, map, take } from 'rxjs';

@Component({
  selector: 'app-reference-data-select-type',
  templateUrl: './reference-data-select-type.component.html'
})
export class ReferenceDataSelectTypeComponent {
  form: CustomFormGroup = new CustomFormGroup(
    { name: 'form-group', type: FormNodeTypes.GROUP },
    {
      referenceType: new CustomFormControl({ name: 'referenceType', type: FormNodeTypes.CONTROL }, undefined, [Validators.required])
    }
  );

  constructor(
    private globalErrorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {
    this.referenceDataService.loadReferenceData(ReferenceDataResourceType.ReferenceDataAdminType);
  }

  get options$(): Observable<Array<FormNodeOption<string>>> {
    return this.store.pipe(
      select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.ReferenceDataAdminType)),
      take(1),
      map(types => types?.map(type => ({ label: this.titleCase(type.resourceKey), value: `${type.resourceKey}` })) ?? [])
    );
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];
    DynamicFormService.validate(this.form, errors);
    this.globalErrorService.setErrors(errors);
    return this.form.valid;
  }

  titleCase(input: string | number | boolean): string {
    return this.referenceDataService.macroCasetoTitleCase(input);
  }

  cancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  navigateTo(type: string): void {
    if (this.isFormValid) this.router.navigate(['..'], { relativeTo: this.route, queryParams: { type } });
  }
}
