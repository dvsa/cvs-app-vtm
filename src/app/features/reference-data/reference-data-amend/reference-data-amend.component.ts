import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { fetchReferenceDataByKey, fetchReferenceDataByKeySearch, ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, take } from 'rxjs';

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
  refDataAdminType: any | undefined;

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
      this.store
        .pipe(select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)))
        .subscribe(type => (this.refDataAdminType = type));

      if (this.type && this.key) {
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
