import { Component, OnChanges, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-reference-data-amend',
  templateUrl: './reference-data-amend.component.html'
})
export class ReferenceDataAmendComponent implements OnInit {
  type!: ReferenceDataResourceType;
  key!: string;
  data: any;
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
        this.store.pipe(select(selectReferenceDataByResourceKey(this.type, this.key)))
          .subscribe(data => this.data = data);

        // load the reference data admin type, the current item and check if it has any audit history
        this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
        this.referenceDataService.loadReferenceDataByKey(this.type, this.key);
      }
    });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get refDataAdminType$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)));
  }

  get data$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, this.key)));
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit() {
    this.checkForms();

    if (this.isFormInvalid) return;

    // const referenceData: any = {};

    // Object.keys(this.data)
    //   .filter(amendDataKey => amendDataKey !== 'resourceKey')
    //   .forEach(amendDataKey => (referenceData[amendDataKey] = this.amendedData[amendDataKey]));

    this.referenceDataService
      .amendReferenceDataItem(this.type, this.key, this.data)
      .pipe(take(1))
      .subscribe(() => this.navigateBack());
  }

  handleFormChange(event: any) {
    // this.amendedData = event;
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
