import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateVin, updateVinSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';

@Component({
  selector: 'app-change-amend-vin',
  templateUrl: './tech-record-amend-vin.component.html'
})
export class AmendVinComponent {
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
      [Validators.minLength(3), Validators.maxLength(21), Validators.required]
    )
  });

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
      ?.valueChanges.pipe()
      .subscribe(() => delete this.message);
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
