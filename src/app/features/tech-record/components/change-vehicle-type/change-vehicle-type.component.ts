import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { changeVehicleType, updateEditingTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { take, map } from 'rxjs';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './change-vehicle-type.component.html'
})
export class ChangeVehicleTypeComponent implements OnInit, OnChanges {
  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
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
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicle = data));

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

  get makeAndModel(): string {
    const c = this.currentTechRecord;
    if (!c?.make && !c?.chassisMake) return '';

    return `${c.vehicleType === 'psv' ? c.make : c.chassisMake} - ${c.vehicleType === 'psv' ? c.model : c.chassisModel}`;
  }

  get currentVrm(): string | undefined {
    return this.vehicle?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnumAcronym(VehicleTypes).filter(
      type => type.value !== this.currentTechRecord?.vehicleType && type.value !== VehicleTypes.MOTORCYCLE
    );
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(selectedVehicleType: VehicleTypes): void {
    if (!selectedVehicleType) {
      this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
      return;
    } else if (selectedVehicleType !== VehicleTypes.PSV) {
      this.globalErrorService.addError({ error: 'That technical feature will be implemented soon', anchorLink: 'selectedVehicleType' });
      return;
    }

    this.store.dispatch(changeVehicleType({ vehicleType: selectedVehicleType }));

    this.clearReasonForCreation();

    const routeSuffix = this.currentTechRecord?.statusCode !== StatusCodes.PROVISIONAL ? 'amend-reason' : 'notifiable-alteration-needed';

    this.router.navigate([`../${routeSuffix}`], { relativeTo: this.route });
  }

  clearReasonForCreation(): void {
    this.technicalRecordService.editableTechRecord$
      .pipe(
        map(data => data ?? cloneDeep(this.vehicle)),
        take(1)
      )
      .subscribe(data => this.store.dispatch(updateEditingTechRecord({ techRecord: { ...data, reasonForCreation: '' } as TechRecordModel })));
  }
}
