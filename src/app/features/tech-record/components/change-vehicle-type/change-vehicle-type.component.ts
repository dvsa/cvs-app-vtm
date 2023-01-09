import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { MultiOptions } from '@forms/models/options.model';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './change-vehicle-type.component.html',
  styleUrls: ['./change-vehicle-type.component.scss']
})
export class ChangeVehicleTypeComponent implements OnInit, OnChanges {
  constructor(
    public dfs: DynamicFormService,
    public globalErrorService: GlobalErrorService,
    private technicalRecordService: TechnicalRecordService,
    private location: Location
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleTechRecord = data));
    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(data => (this.currentTechRecord = data));
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

  ngOnChanges(changes: SimpleChanges): void {
    this.globalErrorService.clearErrors();

    const { vehicleTechRecord } = changes;

    if (this.form && vehicleTechRecord?.currentValue && vehicleTechRecord.currentValue !== vehicleTechRecord.previousValue) {
      this.form.patchValue(vehicleTechRecord.currentValue, { emitEvent: false });
    }
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnum(VehicleTypes);
  }

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
    if (this.vehicleTechRecord === undefined) {
      this.navigateBack();
    }
  }

  handleSubmitNewVehicleType(selectedVehicleType: string): void {
    console.log(this.currentTechRecord);
    console.log(selectedVehicleType);

    if (!selectedVehicleType || selectedVehicleType === this.currentTechRecord?.vehicleType) {
      this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
      return;
    } else if (
      selectedVehicleType === VehicleTypes.CAR ||
      selectedVehicleType === VehicleTypes.MOTORCYCLE ||
      selectedVehicleType === VehicleTypes.LGV ||
      selectedVehicleType === VehicleTypes.HGV ||
      selectedVehicleType === VehicleTypes.TRL
    ) {
      this.globalErrorService.addError({ error: 'That technical feature will be implemented soon', anchorLink: 'selectedVehicleType' });
    }

    // TODO:

    // filter this.vehicleTechRecord by selectedVehicleType to remove unwanted fields
    // dispatch new data model/'third entity' to editingTechRecord
    // navigate to amend to be prompted to fill in new fields
    // update dynamo tech record with new structure on submit
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.location.back();
  }
}
