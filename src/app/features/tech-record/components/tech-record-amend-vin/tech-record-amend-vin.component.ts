import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { TechRecordModel, V3TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectTechRecord, updateTechRecords, updateTechRecords2, updateTechRecordsSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-amend-vin',
  templateUrl: './tech-record-amend-vin.component.html'
})
export class AmendVinComponent implements OnDestroy {
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
    this.store
      .select(selectTechRecord)
      .pipe(take(1))
      .subscribe(record => (!record ? this.navigateBack() : (this.techRecord = record)));

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

    this.actions$.pipe(ofType(updateTechRecordsSuccess), takeUntil(this.destroy$)).subscribe(item => {
      console.log(item.vehicleTechRecords);
      this.router.navigate([`/tech-records/${item.vehicleTechRecords[0].systemNumber}/${item.vehicleTechRecords[0].createdTimestamp}`]);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get makeAndModel(): string {
    //TODO: remove as any
    const c = this.techRecord as any;
    if (!c?.techRecord_make && !c?.techRecord_chassisMake) return '';

    return `${c.techRecord_vehicleType === 'psv' ? c.techRecord_chassisMake : c.techRecord_make} - ${
      c.techRecord_vehicleType === 'psv' ? c.techRecord_chassisModel : c.techRecord_model
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
      this.store.dispatch(updateTechRecords2({ vehicleTechRecord: record }));
    }
  }
}
