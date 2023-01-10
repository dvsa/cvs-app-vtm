import { Component, OnChanges, OnInit } from '@angular/core';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes, Params } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { MultiOptions } from '@forms/models/options.model';
import { changeVehicleType } from '@store/technical-records';
import { Store } from '@ngrx/store';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './change-vehicle-type.component.html'
})
export class ChangeVehicleTypeComponent implements OnInit, OnChanges {
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

  constructor(
    public globalErrorService: GlobalErrorService,
    public dfs: DynamicFormService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleTechRecord = data));
    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(data => (this.currentTechRecord = data));
    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
  }

  ngOnInit(): void {
    if (!this.currentTechRecord) {
      this.navigateBack();
    }
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnumAcronym(VehicleTypes).filter(
      vehicleType => vehicleType.value !== this.currentTechRecord?.vehicleType && vehicleType.value !== VehicleTypes.MOTORCYCLE
    );
  }

  get vehicleMakeAndModel(): string {
    if (!this.currentTechRecord) return '';
    if (!this.currentTechRecord.make && !this.currentTechRecord.chassisMake) return '';

    return this.currentTechRecord.vehicleType !== 'psv'
      ? `${this.currentTechRecord.make} - ${this.currentTechRecord.model}`
      : `${this.currentTechRecord.chassisMake} - ${this.currentTechRecord.chassisModel}`;
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
      ? this.navigateTo('../amend-reason')
      : this.navigateTo('../notifiable-alteration-needed');
  }

  navigateTo(path: string, queryParams?: Params): void {
    this.router.navigate([path], { relativeTo: this.route, queryParams });
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.navigateTo('../');
  }
}
