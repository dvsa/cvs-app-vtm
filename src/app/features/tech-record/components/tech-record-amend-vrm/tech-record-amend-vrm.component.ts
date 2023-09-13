import { Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
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
  isCherishedTransfer?: boolean = false;
  vrmInfo: any;
  cherishedTransferForm: FormGroup = new FormGroup({
    donorVrm: new CustomFormControl(
      { name: 'new-vrm', label: 'Input a new VRM', type: FormNodeTypes.CONTROL },
      '',
      [Validators.required, CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [CustomAsyncValidators.validateDonorVrmField(this.technicalRecordService)]
    ),
    recipientVrm: new CustomFormControl({ name: 'recipient-vrm', label: 'recipient vehicle VRM', type: FormNodeTypes.CONTROL, disabled: true }),
    newDonorVrm: new CustomFormControl(
      { name: 'new-donor-vrm', label: 'Input a new VRM for donor vehicle', type: FormNodeTypes.CONTROL },
      '',
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [CustomAsyncValidators.validateVrmDoesNotExist(this.technicalRecordService)]
    )
  });
  correctingAnErrorForm: FormGroup = new FormGroup({
    newVrm: new CustomFormControl(
      { name: 'new-vrm', label: 'Input a new VRM', type: FormNodeTypes.CONTROL },
      '',
      [Validators.required, CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [CustomAsyncValidators.validateVrmDoesNotExist(this.technicalRecordService)]
    )
  });

  @Output() isFormDirty = new EventEmitter<boolean>();
  @Output() isFormInvalid = new EventEmitter<boolean>();

  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;

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

    this.cherishedTransferForm.get('recipientVrm')?.setValue(this.techRecord?.primaryVrm);
    this.cherishedTransferForm.get('recipientVrm')?.disable();

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

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleFormChange(event: any) {
    this.vrmInfo = event;
  }

  handleSubmit(): void {
    if (this.isCherishedTransfer) {
      console.log(this.isFormValid(this.cherishedTransferForm));
      if (this.isFormValid(this.cherishedTransferForm)) {
        this.store.dispatch(
          amendVrm({
            newVrm: this.cherishedTransferForm.value.donorVrm,
            cherishedTransfer: true,
            newDonorVrm: this.cherishedTransferForm.value.newDonorVrm ?? '',
            systemNumber: (this.techRecord as TechRecordType<'get'>)?.systemNumber!,
            createdTimestamp: (this.techRecord as TechRecordType<'get'>)?.createdTimestamp!
          })
        );
        return;
      }
    } else {
      if (this.isFormValid(this.correctingAnErrorForm)) {
        this.store.dispatch(
          amendVrm({
            newVrm: this.correctingAnErrorForm.value.newVrm,
            cherishedTransfer: false,
            newDonorVrm: '',
            systemNumber: (this.techRecord as TechRecordType<'get'>)?.systemNumber!,
            createdTimestamp: (this.techRecord as TechRecordType<'get'>)?.createdTimestamp!
          })
        );
      }
      return;
    }
  }

  isFormValid(form: FormGroup): boolean {
    this.globalErrorService.clearErrors();

    const errors: GlobalError[] = [];

    DynamicFormService.validate(form, errors, false);

    if (errors?.length) {
      this.globalErrorService.setErrors(errors);
    }

    return form.valid;
  }
}
