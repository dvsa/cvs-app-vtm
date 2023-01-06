import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './change-vehicle-type.component.html',
  styleUrls: ['./change-vehicle-type.component.scss']
})
export class ChangeVehicleTypeComponent implements OnInit {
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
    name: 'selectVehicleType',
    label: 'Choose vehicle type',
    value: '',
    type: FormNodeTypes.CONTROL
  };

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  ngOnInit(): void {
    console.log('hi');
    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.location.back();
  }
}
