import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { template as brakesTemplate } from '@forms/templates/reference-data/brakes';
import { template as countryOfRegistrationTemplate } from '@forms/templates/reference-data/country-of-registration';
import { template as hgvTemplate } from '@forms/templates/reference-data/hgv-make';
import { template as psvTemplate } from '@forms/templates/reference-data/psv-make';
import { template as reasonsForAbandoningHgvTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-hgv';
import { template as reasonsForAbandoningPsvTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-psv';
import { template as reasonsForAbandoningTirTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-TIR';
import { template as reasonsForAbandoningTrlTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-TRL';
import { template as specialistReasonsForAbandoningTemplate } from '@forms/templates/reference-data/specialist-reasons-for-abandoning';
import { template as trlTemplate } from '@forms/templates/reference-data/trl-make';
import { template as tyresTemplate } from '@forms/templates/reference-data/tyres';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, catchError, filter, of, switchMap, take, throwError } from 'rxjs';

@Component({
  selector: 'app-reference-data-add',
  templateUrl: './reference-data-add.component.html'
})
export class ReferenceDataCreateComponent implements OnInit {
  isEditing: boolean = true;
  type: ReferenceDataResourceType = ReferenceDataResourceType.Brakes;
  newRefData: any;
  isFormDirty: boolean = false;
  isFormInvalid: boolean = true;
  refDataAdminType: any | undefined;

  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;

  constructor(
    public globalErrorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {
    this.referenceDataService.loadReferenceData(ReferenceDataResourceType.ReferenceDataAdminType);
  }

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.type = params['type'];
      this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
      this.store
        .pipe(take(1), select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)))
        .subscribe(type => (this.refDataAdminType = type));
    });
  }
  //I feel like the issue is this being a getter, may want to be stored as a variable then accessed. A bit like tech records
  // get refDataAdminType$(): Observable<any | undefined> {
  //   return this.store.pipe(select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)));
  // }

  get roles(): typeof Roles {
    return Roles;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  // get template(): FormNode {
  //   let templateToReturn: FormNode;
  //   switch (this.type) {
  //     case ReferenceDataResourceType.Brakes:
  //       templateToReturn = brakesTemplate;
  //       break;
  //     case ReferenceDataResourceType.CountryOfRegistration:
  //       templateToReturn = countryOfRegistrationTemplate;
  //       break;
  //     case ReferenceDataResourceType.HgvMake:
  //       templateToReturn = hgvTemplate;
  //       break;
  //     case ReferenceDataResourceType.PsvMake:
  //       templateToReturn = psvTemplate;
  //       break;
  //     case ReferenceDataResourceType.ReasonsForAbandoningHgv:
  //       templateToReturn = reasonsForAbandoningHgvTemplate;
  //       break;
  //     case ReferenceDataResourceType.ReasonsForAbandoningPsv:
  //       templateToReturn = reasonsForAbandoningPsvTemplate;
  //       break;
  //     case ReferenceDataResourceType.ReasonsForAbandoningTrl:
  //       templateToReturn = reasonsForAbandoningTrlTemplate;
  //       break;
  //     case ReferenceDataResourceType.SpecialistReasonsForAbandoning:
  //       templateToReturn = specialistReasonsForAbandoningTemplate;
  //       break;
  //     case ReferenceDataResourceType.TirReasonsForAbandoning:
  //       templateToReturn = reasonsForAbandoningTirTemplate;
  //       break;
  //     case ReferenceDataResourceType.TrlMake:
  //       templateToReturn = trlTemplate;
  //       break;
  //     case ReferenceDataResourceType.Tyres:
  //       templateToReturn = tyresTemplate;
  //       break;
  //     default:
  //       templateToReturn = {} as FormNode;
  //       break;
  //   }
  //   templateToReturn.children?.forEach(child => {
  //     if (child.name === 'resourceKey') {
  //       child.disabled = false;
  //     }
  //   });
  //   return templateToReturn;
  // }

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
    this.checkForms();

    if (this.isFormInvalid) return;

    const referenceData: any = {};

    Object.keys(this.newRefData)
      .filter(newRefDataKey => newRefDataKey !== 'resourceKey')
      .forEach(dataKey => (referenceData[dataKey] = this.newRefData[dataKey]));

    this.globalErrorService.errors$
      .pipe(
        take(1),
        filter(errors => !errors.length),
        switchMap(() => this.referenceDataService.fetchReferenceDataByKey(this.type, this.newRefData.resourceKey)),
        take(1),
        catchError(error => (error.status == 200 ? of(true) : throwError(() => new Error('Error'))))
      )
      .subscribe({
        next: res => {
          if (res) return this.globalErrorService.addError({ error: 'Resource Key already exists', anchorLink: 'newReferenceData' });
        },
        error: e =>
          e.status == 404
            ? of(true)
            : this.referenceDataService
                .createNewReferenceDataItem(this.type, this.newRefData.resourceKey, referenceData)
                .pipe(take(1))
                .subscribe(() => this.navigateBack())
      });
  }

  handleFormChange(event: any) {
    this.newRefData = event;
  }

  checkForms(): void {
    const forms = this.sections.map(section => section.form) as Array<CustomFormGroup>;

    this.isFormDirty = forms.some(form => form.dirty);

    this.setErrors(forms);

    this.isFormInvalid = forms.some(form => form.invalid);
  }

  setErrors(forms: Array<CustomFormGroup>): void {
    const errors: GlobalError[] = [];

    forms.forEach(form => DynamicFormService.validate(form, errors));

    errors.length ? this.globalErrorService.setErrors(errors) : this.globalErrorService.clearErrors();
  }
}
