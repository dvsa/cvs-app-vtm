import {
  Component, OnInit, QueryList, ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { RouterService } from '@services/router/router.service';
import { ReferenceDataState, amendReferenceDataItem, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-reference-data-amend',
  templateUrl: './reference-data-amend.component.html',
})
export class ReferenceDataAmendComponent implements OnInit {
  type!: ReferenceDataResourceType;
  key!: string;
  isFormDirty = false;
  isFormInvalid = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amendedData: any;

  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;

  constructor(
    public globalErrorService: GlobalErrorService,
    public dfs: DynamicFormService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private store: Store<ReferenceDataState>,
    public routerService: RouterService,
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.pipe(first()).subscribe((params) => {
      this.type = params['type'];
      // load the reference data admin type
      this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
    });

    this.route.params.pipe(first()).subscribe((params) => {
      this.key = decodeURIComponent(params['key']);

      if (this.type && this.key) {
        // load the current item
        this.referenceDataService.loadReferenceDataByKey(this.type, this.key);
      }
    });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get refDataAdminType$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get data$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, this.key)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFormChange(event: any) {
    this.amendedData = event;
  }

  checkForms(): void {
    const forms = this.sections.map((section) => section.form) as Array<CustomFormGroup>;

    this.isFormDirty = forms.some((form) => form.dirty);

    this.setErrors(forms);

    this.isFormInvalid = forms.some((form) => form.invalid);
  }

  setErrors(forms: Array<CustomFormGroup>): void {
    const errors: GlobalError[] = [];

    forms.forEach((form) => DynamicFormService.validate(form, errors));

    if (errors.length) {
      this.globalErrorService.setErrors(errors);
      return;
    }

    this.globalErrorService.clearErrors();
  }

  handleSubmit() {
    this.checkForms();

    if (this.isFormInvalid) return;

    this.store.dispatch(
      amendReferenceDataItem({
        resourceType: this.type,
        resourceKey: encodeURIComponent(String(this.key)),
        payload: this.amendedData,
      }),
    );

    this.sections.forEach((form) => {
      form.ngOnDestroy();
    });

    this.routerService.navigateBack();
  }
}
