import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-amend-vin',
  templateUrl: './tech-record-amend-vin.component.html'
})
export class AmendVinComponent implements OnDestroy, OnInit {
  techRecord?: V3TechRecordModel;
  form: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private store: Store<TechnicalRecordServiceState>
  ) {
    this.form = new FormGroup({
      vin: new CustomFormControl(
        {
          name: 'input-vin',
          label: 'Vin',
          type: FormNodeTypes.CONTROL
        },
        '',
        [CustomValidators.alphanumeric(), Validators.minLength(3), Validators.maxLength(21), Validators.required],
        [this.technicalRecordService.validateVinForUpdate(this.techRecord?.vin)]
      )
    });
    this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      this.router.navigate([`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`]);
    });
  }

  ngOnInit(): void {
    this.technicalRecordService.techRecord$.pipe(take(1)).subscribe(record => (!record ? this.navigateBack() : (this.techRecord = record)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get makeAndModel(): string {
    //TODO: V3 remove as any PSV? HGV?
    if (!(this.techRecord as any)?.techRecord_make && !(this.techRecord as any)?.techRecord_chassisMake) return '';

    return `${
      this.techRecord?.techRecord_vehicleType === 'psv' ? (this.techRecord as any).techRecord_chassisMake : (this.techRecord as any).techRecord_make
    } - ${
      (this.techRecord as any).techRecord_vehicleType === 'psv'
        ? (this.techRecord as any).techRecord_chassisModel
        : (this.techRecord as any).techRecord_model
    }`;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    this.globalErrorService.setErrors(errors);

    if (this.form.value.vin === this.techRecord?.vin) {
      this.globalErrorService.addError({ error: 'You must provide a new VIN', anchorLink: 'newVin' });
      return false;
    }

    return this.form.valid;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    const record: V3TechRecordModel = { ...this.techRecord! };
    record.vin = this.form.value.vin;

    if (this.isFormValid() || (this.form.status === 'PENDING' && this.form.errors === null)) {
      record.techRecord_reasonForCreation = 'Vin changed';
      this.store.dispatch(updateTechRecord({ vehicleTechRecord: record }));
    }
  }
}
