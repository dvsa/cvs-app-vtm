import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
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
    private technicalRecordService: TechnicalRecordService,
    public globalErrorService: GlobalErrorService,
    public dfs: DynamicFormService,
    private location: Location
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleTechRecord = data));
  }

  public vehicleTechRecord?: VehicleTechRecordModel;
  public form!: CustomFormGroup;

  public template: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'selectVehicleType',
        label: 'Choose vehicle type',
        value: '',
        type: FormNodeTypes.CONTROL
      }
    ]
  };

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log(this.form);

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
      // fetch and pop state when page refreshes?
    }
  }

  handleSubmitNewVehicleType(selectedVehicleType: string): void {
    console.log(selectedVehicleType);
    // big brain boi logic go here
    console.log(this.location);
    // got to /notifiable-alteration-needed
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.location.back();
  }
}
