import { Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { NotTrailer, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss']
})
export class AmendVrmComponent implements OnDestroy, OnInit {
  techRecord?: NotTrailer;
  makeAndModel?: string;
  isCherishedTransfer?: boolean = false;
  systemNumber?: string;
  createdTimestamp?: string;
  cherishedTransferForm = new FormGroup({
    currentVrm: new CustomFormControl(
      { name: 'current-Vrm', type: FormNodeTypes.CONTROL },
      '',
      [Validators.required, CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [this.technicalRecordService.validateVrmForCherishedTransfer()]
    ),
    previousVrm: new CustomFormControl({ name: 'previous-Vrm', type: FormNodeTypes.CONTROL, disabled: true }),
    thirdMark: new CustomFormControl(
      { name: 'third-Mark', type: FormNodeTypes.CONTROL },
      undefined,
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [this.technicalRecordService.validateVrmDoesNotExist()]
    )
  });
  correctingAnErrorForm = new FormGroup({
    newVrm: new CustomFormControl(
      { name: 'new-Vrm', type: FormNodeTypes.CONTROL },
      '',
      [Validators.required, CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [this.technicalRecordService.validateVrmDoesNotExist()]
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
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.systemNumber = params['systemNumber'];
      this.createdTimestamp = params['createdTimestamp'];
      this.isCherishedTransfer = params['reason'] === 'cherished-transfer' ? true : false;
    });
    this.technicalRecordService.techRecord$.pipe(take(1), takeUntil(this.destroy$)).subscribe(record => {
      if (record?.techRecord_statusCode === 'archived' || !record) {
        return this.navigateBack();
      }
      this.techRecord = record as NotTrailer;
      this.makeAndModel = this.technicalRecordService.getMakeAndModel(record);
    });

    this.actions$.pipe(ofType(amendVrmSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      this.router.navigate(['/tech-records', `${vehicleTechRecord.systemNumber}`, `${vehicleTechRecord.createdTimestamp}`]);
    });

    this.cherishedTransferForm.get('previousVrm')?.setValue(this.techRecord?.primaryVrm);
    this.cherishedTransferForm.get('previousVrm')?.disable();
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
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  handleFormChange() {
    if (this.isCherishedTransfer) {
      console.log(this.cherishedTransferForm.get('currentVrm')?.value);
      this.cherishedTransferForm.get('currentVrm')?.updateValueAndValidity();
      return;
    }
  }

  handleSubmit(): void {
    if (this.isCherishedTransfer) {
      if (this.isFormValid(this.cherishedTransferForm)) {
        this.store.dispatch(
          amendVrm({
            newVrm: this.cherishedTransferForm.value.currentVrm,
            cherishedTransfer: true,
            newDonorVrm: this.cherishedTransferForm.value.thirdMark,
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

    if (errors?.length > 0) {
      this.globalErrorService.setErrors(errors);
      return false;
    }

    return true;
  }
}
