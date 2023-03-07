import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { EuVehicleCategories, StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
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
  techRecord?: TechRecordModel;

  form: CustomFormGroup;
  template: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'selectVehicleType',
        label: 'Select a new vehicle type',
        value: '',
        type: FormNodeTypes.CONTROL
      }
    ]
  };

  constructor(
    public dfs: DynamicFormService,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.globalErrorService.clearErrors();

    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => (this.vehicle = vehicle));

    this.technicalRecordService.editableTechRecord$
      .pipe(take(1))
      .subscribe(techRecord => (!techRecord ? this.navigateBack() : (this.techRecord = techRecord)));

    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
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
    return this.techRecord?.vehicleType === VehicleTypes.TRL && this.techRecord.euVehicleCategory === EuVehicleCategories.O1
      ? VehicleTypes.SMALL_TRL
      : this.techRecord?.vehicleType;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnumAcronym(VehicleTypes).filter(
      type => type.value !== this.techRecord?.vehicleType && type.value !== VehicleTypes.MOTORCYCLE
    );
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(selectedVehicleType: VehicleTypes): void {
    if (!selectedVehicleType) {
      return this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
    }

    if (selectedVehicleType === VehicleTypes.TRL && this.techRecord?.euVehicleCategory === EuVehicleCategories.O1) {
      return this.globalErrorService.addError({
        error: "You cannot change vehicle type to TRL when EU vehicle category is set to 'O1'",
        anchorLink: 'selectedVehicleType'
      });
    }

    this.store.dispatch(changeVehicleType({ vehicleType: selectedVehicleType }));

    this.technicalRecordService.clearReasonForCreation(this.vehicle);

    const routeSuffix = this.techRecord?.statusCode !== StatusCodes.PROVISIONAL ? 'amend-reason' : 'notifiable-alteration-needed';

    this.router.navigate([`../${routeSuffix}`], { relativeTo: this.route });
  }
}
