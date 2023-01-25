import { Component, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiOptions } from '@forms/models/options.model';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnChanges {
  vehicle: Partial<VehicleTechRecordModel> = {};

  vehicleForm = new FormGroup({
    vin: new CustomFormControl(
      {
        name: 'input-vin',
        type: FormNodeTypes.CONTROL
      },
      '',
      [Validators.minLength(3), Validators.maxLength(21), Validators.required]
    ),
    vrmTrm: new CustomFormControl({ name: 'input-vrm-or-trailer-id', type: FormNodeTypes.CONTROL }, '', [
      Validators.minLength(1),
      Validators.maxLength(9),
      Validators.required
    ]),
    vehicleStatus: new CustomFormControl({ name: 'change-vehicle-status-select', type: FormNodeTypes.CONTROL }, '', [Validators.required]),
    vehicleType: new CustomFormControl({ name: 'change-vehicle-type-select', type: FormNodeTypes.CONTROL }, '', [Validators.required])
  });

  constructor(
    private globalErrorService: GlobalErrorService,
    private technicalRecordService: TechnicalRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  get vehicleTypeOptions(): MultiOptions {
    return [
      { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
      { label: 'Light goods vehicle (LGV)', value: VehicleTypes.LGV },
      { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
      { label: 'Trailer (TRL)', value: VehicleTypes.TRL }
    ];
  }

  get vehicleStatusOptions(): MultiOptions {
    return [
      { label: 'Current', value: StatusCodes.CURRENT },
      { label: 'Provisional', value: StatusCodes.PROVISIONAL }
    ];
  }

  get primaryVrm(): string {
    return this.vehicle.vrms!.find(vrm => vrm.isPrimary)!.vrm;
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.updateValidity(this.vehicleForm, errors);

    this.globalErrorService.setErrors(errors);

    return this.vehicleForm.valid;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async handleSubmit() {
    if (!this.isFormValid || !(await this.isFormValueUnique())) return;

    this.technicalRecordService.updateEditingTechRecord(this.vehicle as VehicleTechRecordModel);
    this.technicalRecordService.generateEditingVehicleTechnicalRecordFromVehicleType(this.vehicle.techRecord![0].vehicleType);
    await this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
  }

  async isFormValueUnique() {
    const isTrailer = this.vehicleForm.value.vehicleType === VehicleTypes.TRL;
    this.vehicle.techRecord = [
      { vehicleType: this.vehicleForm.value.vehicleType, statusCode: this.vehicleForm.value.vehicleStatus } as TechRecordModel
    ];

    const isVinUnique = await this.isVinUnique();

    if (isTrailer) {
      const isTrailerIdUnique = await this.isTrailerIdUnique();
      return isVinUnique && isTrailerIdUnique;
    } else {
      const isVrmUnique = await this.isVrmUnique();
      return isVinUnique && isVrmUnique;
    }
  }

  async isVinUnique() {
    this.vehicle.vin = this.vehicleForm.value.vin;
    const isVinUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.vin!, SEARCH_TYPES.VIN));
    if (!isVinUnique) {
      this.globalErrorService.addError({ error: 'Vin not unique', anchorLink: 'input-vin' });
    }
    return isVinUnique;
  }

  async isVrmUnique() {
    this.vehicle.vrms = [{ vrm: this.vehicleForm.value.vrmTrm, isPrimary: true }];
    const isVrmUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.primaryVrm.replace(/\s+/g, ''), SEARCH_TYPES.VRM));
    if (!isVrmUnique) {
      this.globalErrorService.addError({ error: 'Vrm not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isVrmUnique;
  }

  async isTrailerIdUnique() {
    this.vehicle.trailerId = this.vehicleForm.value.vrmTrm;
    const isTrailerIdUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.trailerId!, SEARCH_TYPES.TRAILER_ID));
    if (!isTrailerIdUnique) {
      this.globalErrorService.addError({ error: 'TrailerId not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isTrailerIdUnique;
  }
}
