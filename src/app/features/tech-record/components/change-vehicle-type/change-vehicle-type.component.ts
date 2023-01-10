import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';
import { getOptionsFromEnum, getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { MultiOptions } from '@forms/models/options.model';
import { changeVehicleType } from '@store/technical-records';
import { Store } from '@ngrx/store';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './change-vehicle-type.component.html'
})
export class ChangeVehicleTypeComponent implements OnInit, OnChanges {
  constructor(
    private technicalRecordService: TechnicalRecordService,
    public globalErrorService: GlobalErrorService,
    private store: Store<TechnicalRecordServiceState>,
    private router: Router,
    private route: ActivatedRoute,
    public dfs: DynamicFormService
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleTechRecord = data));
    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(data => (this.currentTechRecord = data));
    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
  }

  public currentTechRecord?: TechRecordModel;
  public vehicleTechRecord?: VehicleTechRecordModel;
  public form!: CustomFormGroup;

  public template: FormNode = {
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

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnumAcronym(VehicleTypes).filter(vehicleType => vehicleType.value != this.currentTechRecord?.vehicleType);
  }

  get vehicleMakeAndModel(): string | undefined {
    if (!this.currentTechRecord) return '';
    if (!this.currentTechRecord.make && !this.currentTechRecord.chassisMake) return '';

    return this.currentTechRecord.vehicleType !== 'psv'
      ? `${this.currentTechRecord.make} - ${this.currentTechRecord.model}`
      : `${this.currentTechRecord.chassisMake} - ${this.currentTechRecord.chassisModel}`;
  }

  ngOnInit(): void {
    if (this.currentTechRecord === undefined) {
      this.navigateBack();
    }
  }

  handleSubmitNewVehicleType(selectedVehicleType: VehicleTypes): void {
    if (!selectedVehicleType) {
      this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
      return;
    } else if (selectedVehicleType !== VehicleTypes.PSV) {
      this.globalErrorService.addError({ error: 'That technical feature will be implemented soon', anchorLink: 'selectedVehicleType' });
      return;
    }
    this.store.dispatch(changeVehicleType({ vehicleType: selectedVehicleType }));

    this.currentTechRecord?.statusCode !== StatusCodes.PROVISIONAL
      ? this.router.navigate(['../amend-reason'], { relativeTo: this.route })
      : this.router.navigate(['../notifiable-alteration-needed'], { relativeTo: this.route });
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
