import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import {
  CustomFormControl,
  CustomFormGroup,
  FormNodeEditTypes,
  FormNodeTypes,
  FormNodeWidth,
  FormNode,
  FormNodeViewTypes
} from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import {
  ReferenceDataState,
  selectAllReferenceDataByResourceType,
  fetchReferenceDataByKey,
  selectReferenceDataByResourceKey
} from '@store/reference-data';
import { map, Observable, switchMap, take, tap, from } from 'rxjs';
import { template as countryOfRegistrationTemplate } from '@forms/templates/reference-data/country-of-registration';
import { template as tyresTemplate } from '@forms/templates/reference-data/tyres';
import { template as brakesTemplate } from '@forms/templates/reference-data/brakes';
import { template as hgvTemplate } from '@forms/templates/reference-data/hgv-make';
import { template as psvTemplate } from '@forms/templates/reference-data/psv-make';
import { template as reasonsForAbandoningHgvTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-hgv';
import { template as reasonsForAbandoningPsvTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-psv';
import { template as reasonsForAbandoningTirTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-TIR';
import { template as reasonsForAbandoningTrlTemplate } from '@forms/templates/reference-data/reasons-for-abandoning-TRL';
import { template as specialistReasonsForAbandoningTemplate } from '@forms/templates/reference-data/specialist-reasons-for-abandoning';
import { template as trlTemplate } from '@forms/templates/reference-data/trl-make';

@Component({
  selector: 'app-reference-data-amend',
  templateUrl: './reference-data-amend.component.html'
})
export class ReferenceDataAmendComponent implements OnInit {
  type!: ReferenceDataResourceType;
  key!: string;
  isEditing: boolean = true;

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
      }
    });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get data$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, this.key)));
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  // get isFormValid(): boolean {
  //   if (!this.form) return false;

  //   const errors: GlobalError[] = [];
  //   DynamicFormService.validate(this.form, errors);
  //   this.globalErrorService.setErrors(errors);
  //   return this.form.valid;
  // }

  titleCaseHeading(input: ReferenceDataResourceType): string {
    return this.referenceDataService.macroCasetoTitleCase(input);
  }

  titleCaseField(s: string): string {
    return this.referenceDataService.camelCaseToTitleCase(s);
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    // TODO: we need to preserve the type but not the ID (Resource Key)
    this.router.navigate([this.type], { relativeTo: this.route.parent });
  }

  handleSubmit() {
    // TODO: change for amending
    // if (!this.isFormValid) return;
    // const referenceData: any = {};
    // Object.keys(this.form.controls)
    //   .filter(control => control !== 'resourceKey')
    //   .forEach(control => (referenceData[control] = this.form.get(control)?.value));
    // this.referenceDataService
    //   .createNewReferenceDataItem(this.type, this.form.get('resourceKey')?.value, referenceData)
    //   .pipe(take(1))
    //   .subscribe(() => this.navigateBack());
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

  handleFormChange(event: any) {
    // TODO: needed?
    //   let latestTest: any;
    //   this.sections?.forEach(section => {
    //     const { form } = section;
    //     latestTest = merge(latestTest, form.getCleanValue(form));
    //   });
    //   const defectsValue = this.defects?.form.getCleanValue(this.defects?.form);
    //   const customDefectsValue = this.customDefects?.form.getCleanValue(this.customDefects?.form);
    //   latestTest = merge(latestTest, defectsValue, customDefectsValue, event);
    //   latestTest && Object.keys(latestTest).length > 0 && this.newTestResult.emit(latestTest as TestResultModel);
  }
}
