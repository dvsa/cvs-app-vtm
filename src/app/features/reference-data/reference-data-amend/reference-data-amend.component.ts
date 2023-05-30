import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { template as brakesTemplate, templateList as brakesTemplateList } from '@forms/templates/reference-data/brakes';
import {
  template as countryOfRegistrationTemplate,
  templateList as countryOfRegistrationTemplateList
} from '@forms/templates/reference-data/country-of-registration';
import { template as hgvTemplate, templateList as hgvTemplateList } from '@forms/templates/reference-data/hgv-make';
import { template as psvTemplate, templateList as psvTemplateList } from '@forms/templates/reference-data/psv-make';
import {
  template as reasonsForAbandoningHgvTemplate,
  templateList as reasonsForAbandoningHgvTemplateList
} from '@forms/templates/reference-data/reasons-for-abandoning-hgv';
import {
  template as reasonsForAbandoningPsvTemplate,
  templateList as reasonsForAbandoningPsvTemplateList
} from '@forms/templates/reference-data/reasons-for-abandoning-psv';
import {
  template as reasonsForAbandoningTirTemplate,
  templateList as reasonsForAbandoningTirTemplateList
} from '@forms/templates/reference-data/reasons-for-abandoning-TIR';
import {
  template as reasonsForAbandoningTrlTemplate,
  templateList as reasonsForAbandoningTrlTemplateList
} from '@forms/templates/reference-data/reasons-for-abandoning-TRL';
import {
  template as specialistReasonsForAbandoningTemplate,
  templateList as specialistReasonsForAbandoningTemplateList
} from '@forms/templates/reference-data/specialist-reasons-for-abandoning';
import { template as trlTemplate, templateList as trlTemplateList } from '@forms/templates/reference-data/trl-make';
import { template as tyresTemplate, templateList as tyresTemplateList } from '@forms/templates/reference-data/tyres';
import { ReferenceDataResourceType, ReferenceDataResourceTypeAudit } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import {
  fetchReferenceDataByKey,
  fetchReferenceDataByKeySearch,
  ReferenceDataState,
  selectReferenceDataByResourceKey,
  selectSearchReturn
} from '@store/reference-data';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-reference-data-amend',
  templateUrl: './reference-data-amend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferenceDataAmendComponent implements OnInit {
  type!: ReferenceDataResourceType;
  key!: string;
  isEditing: boolean = true;
  amendedData: any;
  isFormDirty: boolean = false;
  isFormInvalid: boolean = true;

  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;

  constructor(
    public globalErrorService: GlobalErrorService,
    public dfs: DynamicFormService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<ReferenceDataState>
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.type = params['type'];
      this.key = params['key'];

      if (this.type && this.key) {
        console.log('This is the key by url params: ', this.key);
        this.store.dispatch(fetchReferenceDataByKey({ resourceType: this.type, resourceKey: this.key }));
        // @ts-ignore
        this.store.dispatch(fetchReferenceDataByKeySearch({ resourceType: this.type + '#AUDIT', resourceKey: this.key }));
      }
    });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get data$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, this.key)));
  }

  get dataAudit$(): Observable<any[] | null> {
    return this.store.pipe(select(selectSearchReturn((this.type + '#AUDIT') as ReferenceDataResourceTypeAudit)));
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  titleCaseHeading(input: ReferenceDataResourceType | string): string {
    return this.referenceDataService.macroCasetoTitleCase(input);
  }

  titleCaseColumn(s: string): string {
    return this.referenceDataService.camelCaseToTitleCase(s);
  }

  titleCaseField(s: string): string {
    return this.referenceDataService.camelCaseToTitleCase(s);
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit() {
    this.checkForms();

    if (this.isFormInvalid) return;

    const referenceData: any = {};

    Object.keys(this.amendedData)
      .filter(amendDataKey => amendDataKey !== 'resourceKey')
      .forEach(amendDataKey => (referenceData[amendDataKey] = this.amendedData[amendDataKey]));

    this.referenceDataService
      .amendReferenceDataItem(this.type, this.amendedData.resourceKey, referenceData)
      .pipe(take(1))
      .subscribe(() => this.navigateBack());
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

  get columns$(): Observable<Array<string>> {
    let templateListToReturn: Array<any>;
    switch (this.type) {
      case ReferenceDataResourceType.Brakes:
        templateListToReturn = brakesTemplateList;
        break;
      case ReferenceDataResourceType.CountryOfRegistration:
        templateListToReturn = countryOfRegistrationTemplateList;
        break;
      case ReferenceDataResourceType.HgvMake:
        templateListToReturn = hgvTemplateList;
        break;
      case ReferenceDataResourceType.PsvMake:
        templateListToReturn = psvTemplateList;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningHgv:
        templateListToReturn = reasonsForAbandoningHgvTemplateList;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningPsv:
        templateListToReturn = reasonsForAbandoningPsvTemplateList;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningTrl:
        templateListToReturn = reasonsForAbandoningTrlTemplateList;
        break;
      case ReferenceDataResourceType.SpecialistReasonsForAbandoning:
        templateListToReturn = specialistReasonsForAbandoningTemplateList;
        break;
      case ReferenceDataResourceType.TirReasonsForAbandoning:
        templateListToReturn = reasonsForAbandoningTirTemplateList;
        break;
      case ReferenceDataResourceType.TrlMake:
        templateListToReturn = trlTemplateList;
        break;
      case ReferenceDataResourceType.Tyres:
        templateListToReturn = tyresTemplateList;
        break;
      default:
        templateListToReturn = [''];
        break;
    }
    console.log(
      templateListToReturn.filter(data => {
        if (data.column !== 'resourceKey') data.column;
      })
    );
    return of(templateListToReturn.filter(data => data.column !== 'resourceKey').map(data => data.column));
  }

  handleFormChange(event: any) {
    this.amendedData = event;
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
