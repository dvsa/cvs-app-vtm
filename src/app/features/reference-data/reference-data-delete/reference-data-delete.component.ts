import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { ValidatorNames } from '@forms/models/validators.enum';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { template as brakesTemplate } from '@forms/templates/reference-data/brakes';
import { template as countryOfRegistrationTemplate } from '@forms/templates/reference-data/country-of-registration';
import { template as hgvTemplate } from '@forms/templates/reference-data/hgv-make';
import { template as psvTemplate } from '@forms/templates/reference-data/psv-make';
import { template as reasonsForAbandoningTirTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-TIR';
import { template as reasonsForAbandoningTrlTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-TRL';
import { template as reasonsForAbandoningHgvTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-hgv';
import { template as reasonsForAbandoningPsvTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-psv';
import { template as specialistReasonsForAbandoningTemplate } from '@forms/templates/reference-data/specialist-reasons-for-abandoning';
import { template as trlTemplate } from '@forms/templates/reference-data/trl-make';
import { template as tyresTemplate } from '@forms/templates/reference-data/tyres';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, fetchReferenceDataByKey, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-reference-data-delete',
  templateUrl: './reference-data-delete.component.html'
})
export class ReferenceDataDeleteComponent {
  type!: ReferenceDataResourceType;
  key!: string;
  reasonForDeletion: any;
  isFormDirty: boolean = false;
  isFormInvalid: boolean = true;

  refDataAdminType$: Observable<any> = of(null);

  reasonTemplate = {
    name: 'reason-for-deletion',
    type: FormNodeTypes.GROUP,
    label: 'reason',
    children: [
      {
        name: 'reason',
        label: 'Reason for Deletion',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.TEXTAREA,
        validators: [
          {
            name: ValidatorNames.Required
          }
        ]
      }
    ]
  };

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
      this.key = params['key'];

      if (this.type && this.key) {
        console.log('This is the key by url params: ', this.key);
        this.store.dispatch(fetchReferenceDataByKey({ resourceType: this.type, resourceKey: this.key }));
      }
    });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get refData$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, this.key)));
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get template(): FormNode {
    let templateToReturn: FormNode;
    switch (this.type) {
      case ReferenceDataResourceType.Brakes:
        templateToReturn = brakesTemplate;
        break;
      case ReferenceDataResourceType.CountryOfRegistration:
        templateToReturn = countryOfRegistrationTemplate;
        break;
      case ReferenceDataResourceType.HgvMake:
        templateToReturn = hgvTemplate;
        break;
      case ReferenceDataResourceType.PsvMake:
        templateToReturn = psvTemplate;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningHgv:
        templateToReturn = reasonsForAbandoningHgvTemplate;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningPsv:
        templateToReturn = reasonsForAbandoningPsvTemplate;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningTrl:
        templateToReturn = reasonsForAbandoningTrlTemplate;
        break;
      case ReferenceDataResourceType.SpecialistReasonsForAbandoning:
        templateToReturn = specialistReasonsForAbandoningTemplate;
        break;
      case ReferenceDataResourceType.TirReasonsForAbandoning:
        templateToReturn = reasonsForAbandoningTirTemplate;
        break;
      case ReferenceDataResourceType.TrlMake:
        templateToReturn = trlTemplate;
        break;
      case ReferenceDataResourceType.Tyres:
        templateToReturn = tyresTemplate;
        break;
      default:
        templateToReturn = {} as FormNode;
        break;
    }
    templateToReturn.children?.forEach(child => {
      if (child.name === 'resourceKey') {
        child.disabled = true;
      }
    });
    return templateToReturn;
  }

  titleCaseHeading(input: ReferenceDataResourceType): string {
    return this.referenceDataService.macroCasetoTitleCase(input);
  }

  handleFormChange(event: any) {
    this.reasonForDeletion = event;
    console.log(this.reasonForDeletion);
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

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate([this.type], { relativeTo: this.route.parent });
  }

  handleSubmit() {
    this.checkForms();

    if (this.isFormInvalid) return;
    // Object.keys(this.amendedData)
    //   .filter(amendDataKey => amendDataKey !== 'resourceKey')
    //   .forEach(amendDataKey => (referenceData[amendDataKey] = this.amendedData[amendDataKey]));

    this.referenceDataService
      .deleteReferenceDataItem(this.type, this.key, this.reasonForDeletion)
      .pipe(take(1))
      .subscribe(() => this.navigateBack());
  }
}
