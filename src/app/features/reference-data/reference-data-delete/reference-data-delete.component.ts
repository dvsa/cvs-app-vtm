import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { ValidatorNames } from '@forms/models/validators.enum';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { fetchReferenceDataByKey, ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, take } from 'rxjs';
@Component({
  selector: 'app-reference-data-delete',
  templateUrl: './reference-data-delete.component.html'
})
export class ReferenceDataDeleteComponent implements OnInit {
  type!: ReferenceDataResourceType;
  key!: string;
  reasonForDeletion: any;
  isFormDirty: boolean = false;
  isFormInvalid: boolean = true;

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
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.type = params['type'];
      this.key = params['key'];

      this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);

      if (this.type && this.key) {
        this.store.dispatch(fetchReferenceDataByKey({ resourceType: this.type, resourceKey: this.key }));
      }
    });
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get refData$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, decodeURIComponent(this.key))));
  }

  get refDataAdminType$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)));
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  titleCaseHeading(input: ReferenceDataResourceType): string {
    return this.referenceDataService.macroCasetoTitleCase(input);
  }

  handleFormChange(event: any) {
    this.reasonForDeletion = event;
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

    this.referenceDataService
      .deleteReferenceDataItem(this.type, this.key, this.reasonForDeletion.reason)
      .pipe(take(1))
      .subscribe(() => {
        this.referenceDataService.removeReferenceDataByKey(this.type, this.key);
        this.navigateBack();
      });
  }
}
