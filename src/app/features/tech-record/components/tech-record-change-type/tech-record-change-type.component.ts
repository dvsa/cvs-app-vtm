import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { changeVehicleType } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './tech-record-change-type.component.html',
  styleUrls: ['./tech-record-change-type.component.scss']
})
export class ChangeVehicleTypeComponent {
  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;

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

    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => (this.vehicle = vehicle));

    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(techRecord => {
      if (!techRecord) this.navigateBack();
      this.currentTechRecord = techRecord;
    });
  }

  get makeAndModel(): string {
    const c = this.currentTechRecord;
    if (!c?.make && !c?.chassisMake) return '';

    return `${c.vehicleType === 'psv' ? c.chassisMake : c.make} - ${c.vehicleType === 'psv' ? c.chassisModel : c.model}`;
  }

  get vrm(): string | undefined {
    return this.vehicle?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnumAcronym(VehicleTypes).filter(type => type.value !== this.currentTechRecord?.vehicleType);
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(selectedVehicleType: VehicleTypes): void {
    if (!selectedVehicleType) {
      return this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
    }

    this.store.dispatch(changeVehicleType({ vehicleType: selectedVehicleType }));

    this.technicalRecordService.clearReasonForCreation(this.vehicle);

    this.globalErrorService.clearErrors();

    const routeSuffix = this.currentTechRecord?.statusCode !== StatusCodes.PROVISIONAL ? 'amend-reason' : 'notifiable-alteration-needed';

    this.router.navigate([`../${routeSuffix}`], { relativeTo: this.route });
  }
}
