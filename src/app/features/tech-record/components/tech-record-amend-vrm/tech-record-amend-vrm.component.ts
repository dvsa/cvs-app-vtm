import { Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { ValidatorNames } from '@forms/models/validators.enum';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import {
  CustomFormArray,
  CustomFormControl,
  CustomFormGroup,
  FormNode,
  FormNodeEditTypes,
  FormNodeOption,
  FormNodeTypes,
  FormNodeWidth
} from '@forms/services/dynamic-form.types';
import { CustomAsyncValidators } from '@forms/validators/custom-async-validators';
import { CustomValidators } from '@forms/validators/custom-validators';
import { NotTrailer, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { Subject, catchError, debounceTime, filter, mergeWith, of, switchMap, take, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss']
})
export class AmendVrmComponent implements OnDestroy, OnInit {
  techRecord?: NotTrailer;
  makeAndModel?: string;
  isCherishedTransfer?: boolean;
  vrmInfo: any;
  @Output() isFormDirty = new EventEmitter<boolean>();
  @Output() isFormInvalid = new EventEmitter<boolean>();

  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;

  form = new FormGroup({
    newVrm: new CustomFormControl(
      { name: 'new-vrm', label: 'Input a new VRM', type: FormNodeTypes.CONTROL },
      '',
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [CustomAsyncValidators.validateVrmDoesNotExist(this.technicalRecordService, this.techRecord?.primaryVrm ?? '', 'newVrm')]
    ),
    donorVrm: new CustomFormControl(
      { name: 'new-vrm', label: 'Input a new VRM', type: FormNodeTypes.CONTROL },
      '',
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [CustomAsyncValidators.validateDonorVrmField(this.technicalRecordService, this.techRecord?.primaryVrm ?? '')]
    ),
    recipientVrm: new CustomFormControl({ name: 'recipient-vrm', label: 'recipient vehicle VRM', type: FormNodeTypes.CONTROL }),
    newDonorVrm: new CustomFormControl(
      { name: 'new-donor-vrm', label: 'Input a new VRM for donor vehicle', type: FormNodeTypes.CONTROL },
      '',
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [CustomAsyncValidators.validateVrmDoesNotExist(this.technicalRecordService, this.techRecord?.primaryVrm ?? '', 'newDonorVrm')]
    )
  });

  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    public dfs: DynamicFormService,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  ngOnInit(): void {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe(record => {
      if (record?.techRecord_statusCode === 'archived' || !record) {
        return this.navigateBack();
      }
      this.techRecord = record as NotTrailer;
      this.makeAndModel = this.technicalRecordService.getMakeAndModel(record);
    });

    this.actions$.pipe(ofType(amendVrmSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      this.router.navigate(['/tech-records', `${vehicleTechRecord.systemNumber}`, `${vehicleTechRecord.createdTimestamp}`]);
    });
    this.form.get('recipientVrm')?.setValue(this.techRecord?.primaryVrm);
    this.form.get('recipientVrm')?.disable();

    this.route.params.pipe(take(1)).subscribe(params => {
      this.isCherishedTransfer = params['reason'] === 'cherished-transfer' ? true : false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  get formTemplate(): FormNode | undefined {
    if (this.isCherishedTransfer) {
      return {
        name: 'cherishedTransfer',
        type: FormNodeTypes.GROUP,
        children: [
          {
            name: 'newVrm',
            label: 'Donor VRM',
            type: FormNodeTypes.CONTROL,
            editType: FormNodeEditTypes.TEXT,
            width: FormNodeWidth.L,
            validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MinLength, args: 3 }, { name: ValidatorNames.MaxLength, args: 9 }]
          },
          {
            name: 'recipientVrm',
            label: 'Recipient VRM',
            type: FormNodeTypes.CONTROL,
            width: FormNodeWidth.L,
            editType: FormNodeEditTypes.TEXT,
            disabled: true,
            value: this.techRecord?.primaryVrm
          },
          {
            name: 'newDonorVrm',
            label: 'New VRM for donor vehicle',
            width: FormNodeWidth.L,
            type: FormNodeTypes.CONTROL,
            editType: FormNodeEditTypes.TEXT,
            validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MinLength, args: 3 }, { name: ValidatorNames.MaxLength, args: 9 }]
          }
        ]
      } as FormNode;
    }
    return {
      name: 'correctingError',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'newVrm',
          label: 'New Vrm',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.L,
          editType: FormNodeEditTypes.TEXT,
          validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MinLength, args: 3 }, { name: ValidatorNames.MaxLength, args: 9 }]
        }
      ]
    } as FormNode;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  // handleFormChange(event: any) {
  //   this.vrmInfo = mergeWith(cloneDeep(this.vrmInfo),event);
  // }

  // checkForms(): void {
  //   const forms = this.sections?.map(section => section.form);

  //   this.isFormDirty.emit(forms.some(form => form.dirty));

  //   this.setErrors(forms);

  //   this.isFormInvalid.emit(forms.some(form => form.invalid));
  // }

  // setErrors(forms: Array<CustomFormGroup | CustomFormArray>): void {
  //   const errors: GlobalError[] = [];

  //   forms.forEach(form => DynamicFormService.validate(form, errors));

  //   errors.length ? this.globalErrorService.setErrors(errors) : this.globalErrorService.clearErrors();
  // }

  handleSubmit(): void {
    // this.checkForms();

    // if (this.isFormInvalid) return;

    // console.log({newVrm: form[0].value.newVrm,
    //   cherishedTransfer: this.reason === 'cherished-transfer' ? true : false,
    //   newDonorVrm: form[0].value.newDonorVrm ?? '',
    //   systemNumber: (this.techRecord as TechRecordType<'get'>)?.systemNumber!,
    //   createdTimestamp: (this.techRecord as TechRecordType<'get'>)?.createdTimestamp!})

    this.store.dispatch(
      amendVrm({
        newVrm: this.isCherishedTransfer ? this.form.value.newDonorVrm : this.form.value.newVrm,
        cherishedTransfer: this.isCherishedTransfer ?? false,
        newDonorVrm: this.form.value.newDonorVrm ?? '',
        systemNumber: (this.techRecord as TechRecordType<'get'>)?.systemNumber!,
        createdTimestamp: (this.techRecord as TechRecordType<'get'>)?.createdTimestamp!
      })
    );
  }
}
