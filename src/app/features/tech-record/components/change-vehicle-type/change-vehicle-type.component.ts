import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { MultiOptions } from '@forms/models/options.model';
import { changeVehicleType } from '@store/technical-records';
import { Store } from '@ngrx/store';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './change-vehicle-type.component.html',
  styleUrls: ['./change-vehicle-type.component.scss']
})
export class ChangeVehicleTypeComponent implements OnInit, OnChanges {
  constructor(
    private technicalRecordService: TechnicalRecordService,
    public globalErrorService: GlobalErrorService,
    private store: Store<TechnicalRecordServiceState>,
    private router: Router,
    private route: ActivatedRoute,
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

  handleSubmitNewVehicleType(selectedVehicleType: VehicleTypes): void {
    if (!selectedVehicleType || selectedVehicleType === this.vehicleTechRecord?.techRecord[0].vehicleType) {
      this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
      return;
    }
    this.store.dispatch(changeVehicleType({ vehicleType: selectedVehicleType }));
    this.router.navigate(['../notifiable-alteration-needed'], { relativeTo: this.route });
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.location.back();
  }
}
