import { Component, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiOptions } from '@forms/models/options.model';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
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
  private vehicle: Partial<VehicleTechRecordModel> = {};

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
    vehicleType: new CustomFormControl({ name: 'change-vehicle-type-select', type: FormNodeTypes.CONTROL }, '', [Validators.required])
  });

  constructor(
    private globalErrorService: GlobalErrorService,
    private technicalRecordService: TechnicalRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  get vehicleTypeOptions(): MultiOptions {
    return [
      { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
      { label: 'Light goods vehicle (LGV)', value: VehicleTypes.LGV },
      { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
      { label: 'Trailer (TRL)', value: VehicleTypes.TRL }
    ];
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  async handleSubmit() {
    if (!this.formIsValid()) {
      return;
    }
    if (!(await this.formValuesUnique())) {
      return;
    }

    console.log(this.vehicle);
    this.technicalRecordService.updateEditingTechRecord(this.vehicle as VehicleTechRecordModel);
    this.technicalRecordService.generateEditingVehicleTechnicalRecordFromVehicleType(this.vehicleForm.value.vehicleType);
    await this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
  }

  private formIsValid(): boolean {
    const errors: GlobalError[] = [];
    DynamicFormService.updateValidity(this.vehicleForm, errors);
    this.globalErrorService.setErrors(errors);
    return this.vehicleForm.valid;
  }

  private async formValuesUnique() {
    const isTrailer = this.vehicleForm.value.vehicleType === VehicleTypes.TRL;
    this.vehicle.techRecord = [{ vehicleType: this.vehicleForm.value.vehicleType } as TechRecordModel];

    const isVinUnique = await this.isVinUnique();

    if (isTrailer) {
      const isTrailerIdUnique = await this.isTrmUnique();
      return isVinUnique && isTrailerIdUnique;
    } else {
      const isVrmUnique = await this.isVrmUnique();
      return isVinUnique && isVrmUnique;
    }
  }

  private async isVinUnique() {
    this.vehicle.vin! = this.vehicleForm.value.vin;
    const isVinUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.vin!, SEARCH_TYPES.VIN));
    if (!isVinUnique) {
      this.globalErrorService.addError({ error: 'Vin not unique', anchorLink: 'input-vin' });
    }
    return isVinUnique;
  }

  private async isTrmUnique() {
    this.vehicle.trailerId = this.vehicleForm.value.vrmTrm;
    const isTrailerIdUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.trailerId!, SEARCH_TYPES.TRAILER_ID));
    if (!isTrailerIdUnique) {
      this.globalErrorService.addError({ error: 'Vin not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isTrailerIdUnique;
  }

  private async isVrmUnique() {
    this.vehicle.vrms = [{ vrm: this.vehicleForm.value.vrmTrm, isPrimary: true }];
    const isVrmUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.getPrimaryVRM(), SEARCH_TYPES.VRM));
    if (!isVrmUnique) {
      this.globalErrorService.addError({ error: 'Vin not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isVrmUnique;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private getPrimaryVRM() {
    return this.vehicle.vrms!.find(vrm => vrm.isPrimary)!.vrm;
  }
}
