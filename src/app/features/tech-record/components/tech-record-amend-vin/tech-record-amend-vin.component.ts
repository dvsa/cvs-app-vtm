import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomAsyncValidators } from '@forms/validators/custom-async-validators';
import { CustomValidators } from '@forms/validators/custom-validators';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateVin, updateVinSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-amend-vin',
  templateUrl: './tech-record-amend-vin.component.html'
})
export class AmendVinComponent implements OnDestroy {
  vehicle?: VehicleTechRecordModel;
  techRecord?: TechRecordModel;
  message?: string;
  form = new FormGroup({
    vin: new CustomFormControl(
      {
        name: 'input-vin',
        label: 'Vin',
        type: FormNodeTypes.CONTROL
      },
      '',
      [Validators.minLength(3), Validators.maxLength(21), Validators.required],
      [this.technicalRecordService.validateVin()]
    )
  });
  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private store: Store<TechnicalRecordServiceState>
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$
      .pipe(take(1))
      .subscribe(vehicle => (!vehicle ? this.navigateBack() : (this.vehicle = vehicle)));

    this.actions$.pipe(ofType(updateVinSuccess), take(1)).subscribe(() => this.navigateBack());

    this.form
      .get('vin')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => delete this.message);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get makeAndModel(): string {
    const c = this.techRecord;
    if (!c?.make && !c?.chassisMake) return '';

    return `${c.vehicleType === 'psv' ? c.chassisMake : c.make} - ${c.vehicleType === 'psv' ? c.chassisModel : c.model}`;
  }

  get vrm(): string | undefined {
    return this.vehicle?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord);
  }

  isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.updateValidity(this.form, errors);

    this.globalErrorService.setErrors(errors);

    if (this.form.value.vin === this.vehicle?.vin) {
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
    if (!this.isFormValid()) return;

    const payload = { newVin: this.form.value.vin, systemNumber: this.vehicle?.systemNumber ?? '' };

    if (this.message) {
      this.store.dispatch(updateVin(payload));
    }

    this.technicalRecordService
      .isUnique(this.form.value.vin, SEARCH_TYPES.VIN)
      .pipe(take(1))
      .subscribe(res => {
        if (!res) {
          this.message = 'This VIN already exists, if you continue it will be associated with two technical records';
        } else {
          this.store.dispatch(updateVin(payload));
        }
      });
  }
}
