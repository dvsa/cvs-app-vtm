import { OnInit, OnChanges, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { changeVehicleType } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';

@Component({
  selector: 'app-change-vehicle-type',
  templateUrl: './change-vehicle-type.component.html',
  styleUrls: ['./change-vehicle-type.component.scss']
})
export class ChangeVehicleTypeComponent implements OnInit, OnChanges {
  vehicleTechRecord?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  form!: CustomFormGroup;

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
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleTechRecord = data));

    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(data => (this.currentTechRecord = data));

    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
  }

  ngOnInit(): void {
    if (!this.vehicleTechRecord) {
      this.navigateBack();
    }
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  get makeAndModel(): string {
    const c = this.currentTechRecord;
    if (!c) return '';

    return `${c.vehicleType === 'psv' ? c.make : c.chassisMake} - ${c.vehicleType === 'psv' ? c.model : c.chassisModel}`;
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleTypeOptions(): MultiOptions {
    return getOptionsFromEnumAcronym(VehicleTypes).filter(vehicleType => vehicleType.value !== this.currentTechRecord?.vehicleType);
  }

  handleSubmit(selectedVehicleType: VehicleTypes): void {
    if (!selectedVehicleType) {
      return this.globalErrorService.addError({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
    }

    this.store.dispatch(changeVehicleType({ vehicleType: selectedVehicleType }));

    const routeSuffix = this.currentTechRecord?.statusCode !== StatusCodes.PROVISIONAL ? 'amend-reason' : 'notifiable-alteration-needed';

    this.router.navigate([`../${routeSuffix}`], { relativeTo: this.route });
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
