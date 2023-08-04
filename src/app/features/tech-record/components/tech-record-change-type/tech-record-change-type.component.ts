import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import {
  EuVehicleCategories,
  StatusCodes,
  TechRecordModel,
  V3TechRecordModel,
  VehicleTechRecordModel,
  VehicleTypes
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { changeVehicleType, selectTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './tech-record-change-type.component.html',
  styleUrls: ['./tech-record-change-type.component.scss']
})
export class ChangeVehicleTypeComponent {
  techRecord?: V3TechRecordModel;

  form: FormGroup = new FormGroup({
    selectVehicleType: new CustomFormControl(
      { name: 'change-vehicle-type-select', label: 'Select a new vehicle type', type: FormNodeTypes.CONTROL },
      '',
      [Validators.required]
    )
  });

  constructor(
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.globalErrorService.clearErrors();

    this.store
      .select(selectTechRecord)
      .pipe(take(1))
      .subscribe(techRecord => (!techRecord ? this.navigateBack() : (this.techRecord = techRecord)));
  }

  get makeAndModel(): string {
    const c = this.techRecord;
    // TODO: remove as any - PSV?
    if (!(c as any)?.techRecord_make && !(c as any)?.techRecord_chassisMake) return '';

    return `${c!.techRecord_vehicleType === 'psv' ? (c as any).chassisMake : (c as any).make} - ${
      (c as any).vehicleType === 'psv' ? (c as any).chassisModel : (c as any).model
    }`;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnumAcronym(VehicleTypes).filter(type => type.value !== this.techRecord?.techRecord_vehicleType);
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(selectedVehicleType: VehicleTypes): void {
    if (!selectedVehicleType) {
      return this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
    }
    // TODO: remove as any
    if (
      selectedVehicleType === VehicleTypes.TRL &&
      ((this.techRecord as any)?.techRecord_euVehicleCategory === EuVehicleCategories.O1 ||
        (this.techRecord as any)?.techRecord_euVehicleCategory === EuVehicleCategories.O2)
    ) {
      return this.globalErrorService.addError({
        error: "You cannot change vehicle type to TRL when EU vehicle category is set to 'O1' or 'O2'",
        anchorLink: 'selectedVehicleType'
      });
    }

    this.store.dispatch(changeVehicleType({ techRecord_vehicleType: selectedVehicleType }));

    this.technicalRecordService.clearReasonForCreation();

    this.globalErrorService.clearErrors();

    const routeSuffix = this.techRecord?.techRecord_statusCode !== StatusCodes.PROVISIONAL ? 'amend-reason' : 'notifiable-alteration-needed';

    this.router.navigate([`../${routeSuffix}`], { relativeTo: this.route });
  }
}
