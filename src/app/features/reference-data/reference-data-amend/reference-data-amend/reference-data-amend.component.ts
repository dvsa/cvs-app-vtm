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
  id!: string;
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
    // query params
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      this.type = params['type'];
      this.id = params['id'];

      if (this.type && this.id) {
        console.log('This is the ID by query params: ', this.id);
        this.store.dispatch(fetchReferenceDataByKey({ resourceType: this.type, resourceKey: this.id }));
        console.log('request sent to fetch reference data by key', this.type, this.id);
      }
    });

    // url params
    // this.route.params.pipe(take(1)).subscribe(params => {
    //   this.type = params['type'];
    //   this.id = params['key'];

    //   if (this.type && this.id) {
    //     console.log("This is the ID by url params: ", this.id);

    //     this.store.dispatch(fetchReferenceDataByKey({ resourceType: this.type, resourceKey: this.id }));
    //   }
    // });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get data$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, this.id)));
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
    this.router.navigate(['..'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
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
    switch (this.type) {
      case ReferenceDataResourceType.Brakes:
        return brakesTemplate;
      case ReferenceDataResourceType.CountryOfRegistration:
        return countryOfRegistrationTemplate;
      case ReferenceDataResourceType.HgvMake:
        return hgvTemplate;
      case ReferenceDataResourceType.PsvMake:
        return psvTemplate;
      case ReferenceDataResourceType.ReasonsForAbandoningHgv:
        return reasonsForAbandoningHgvTemplate;
      case ReferenceDataResourceType.ReasonsForAbandoningPsv:
        return reasonsForAbandoningPsvTemplate;
      case ReferenceDataResourceType.ReasonsForAbandoningTrl:
        return reasonsForAbandoningTrlTemplate;
      case ReferenceDataResourceType.SpecialistReasonsForAbandoning:
        return specialistReasonsForAbandoningTemplate;
      case ReferenceDataResourceType.TirReasonsForAbandoning:
        return reasonsForAbandoningTirTemplate;
      case ReferenceDataResourceType.TrlMake:
        return trlTemplate;
      case ReferenceDataResourceType.Tyres:
        return tyresTemplate;
      default:
        return {} as FormNode;
    }
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
