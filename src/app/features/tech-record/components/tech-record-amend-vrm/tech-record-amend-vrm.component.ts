import {
  Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChildren,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { NotVehicle, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss'],
})
export class AmendVrmComponent implements OnDestroy, OnInit {
  techRecord?: NotVehicle<'trl'>;
  makeAndModel?: string;
  isCherishedTransfer = false;
  systemNumber?: string;
  createdTimestamp?: string;
  formValidity = false;
  width: FormNodeWidth = FormNodeWidth.L;

  cherishedTransferForm = new FormGroup({
    currentVrm: new CustomFormControl(
      {
        name: 'current-Vrm',
        label: 'Current VRM',
        type: FormNodeTypes.CONTROL,
      },
      '',
      [Validators.required, CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      this.technicalRecordService.validateVrmForCherishedTransfer(),
    ),
    previousVrm: new CustomFormControl({
      name: 'previous-Vrm',
      label: 'Previous VRM',
      type: FormNodeTypes.CONTROL,
      disabled: true,
    }),
    thirdMark: new CustomFormControl(
      {
        name: 'third-Mark',
        label: 'Third Mark',
        type: FormNodeTypes.CONTROL,
      },
      undefined,
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
    ),
  });
  correctingAnErrorForm = new FormGroup({
    newVrm: new CustomFormControl(
      {
        name: 'new-Vrm',
        label: 'New VRM',
        type: FormNodeTypes.CONTROL,
      },
      '',
      [Validators.required, CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
    ),
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
    private technicalRecordService: TechnicalRecordService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.systemNumber = params['systemNumber'];
      this.createdTimestamp = params['createdTimestamp'];
      this.isCherishedTransfer = params['reason'] === 'cherished-transfer';
    });
    this.technicalRecordService.techRecord$.pipe(take(1), takeUntil(this.destroy$)).subscribe((record) => {
      if (record?.techRecord_statusCode === 'archived' || !record) {
        return this.navigateBack();
      }
      this.techRecord = record as NotVehicle<'trl'>;
      this.makeAndModel = this.technicalRecordService.getMakeAndModel(record);
    });

    this.actions$.pipe(ofType(amendVrmSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      void this.router.navigate(['/tech-records', `${vehicleTechRecord.systemNumber}`, `${vehicleTechRecord.createdTimestamp}`]);
    });

    this.cherishedTransferForm.controls['previousVrm'].setValue(this.techRecord?.primaryVrm ?? '');
    this.cherishedTransferForm.controls['previousVrm'].disable();
    this.cherishedTransferForm.controls['thirdMark'].setAsyncValidators(
      this.technicalRecordService.validateVrmDoesNotExist(this.techRecord?.primaryVrm ?? ''),
    );
    this.correctingAnErrorForm.controls['newVrm'].setAsyncValidators(
      this.technicalRecordService.validateVrmDoesNotExist(this.techRecord?.primaryVrm ?? ''),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    void this.router.navigate(['../../'], { relativeTo: this.route });
  }

  handleFormChange() {
    if (this.isCherishedTransfer) {
      this.cherishedTransferForm.get('currentVrm')?.updateValueAndValidity();
    }
  }

  handleSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.store.dispatch(
      amendVrm({
        newVrm: this.isCherishedTransfer ? this.cherishedTransferForm.value.currentVrm : this.correctingAnErrorForm.value.newVrm,
        cherishedTransfer: this.isCherishedTransfer,
        thirdMark: this.isCherishedTransfer ? this.cherishedTransferForm.value.thirdMark : undefined,
        systemNumber: (this.techRecord as TechRecordType<'get'>)?.systemNumber,
        createdTimestamp: (this.techRecord as TechRecordType<'get'>)?.createdTimestamp,
      }),
    );
  }

  isFormValid(): boolean {
    this.globalErrorService.clearErrors();

    const errors: GlobalError[] = [];

    if (this.isCherishedTransfer) {
      DynamicFormService.validate(this.cherishedTransferForm, errors, false);
    } else {
      DynamicFormService.validate(this.correctingAnErrorForm, errors, false);
    }

    if (errors?.length > 0) {
      this.globalErrorService.setErrors(errors);
      return false;
    }
    return true;
  }
}
