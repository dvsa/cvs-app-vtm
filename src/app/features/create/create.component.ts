import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiOptions } from '@forms/models/options.model';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent {
  private vehicle: Partial<VehicleTechRecordModel> = {};

  vehicleForm = new FormGroup({
    vin: new FormControl('', [Validators.minLength(3), Validators.maxLength(21), Validators.required]),
    vrmTrm: new FormControl('', [Validators.minLength(1), Validators.maxLength(9), Validators.required]),
    vehicleType: new FormControl('')
  });

  constructor(private technicalRecordService: TechnicalRecordService, private route: ActivatedRoute, private router: Router) {}
  get vehicleTypeOptions(): MultiOptions {
    return [
      { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
      { label: 'Light goods vehicle (LGV)', value: VehicleTypes.LGV },
      { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
      { label: 'Trailer (TRL)', value: VehicleTypes.TRL }
    ];
  }

  async handleSubmit() {
    if (await this.areValuesUnique()) {
      console.log('dispatching');
      this.technicalRecordService.updateEditingTechRecord(this.vehicle as VehicleTechRecordModel);
      this.technicalRecordService.generateEditingVehicleTechnicalRecordFromVehicleType(this.vehicleForm.value.vehicleType);
      this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
    }
    console.log('error');
  }

  private async areValuesUnique() {
    const isTrailer = this.vehicleForm.value.vehicleType === VehicleTypes.TRL;
    this.vehicle.techRecord = [{ vehicleType: this.vehicleForm.value.vehicleType } as TechRecordModel];
    this.vehicle.vin! = this.vehicleForm.value.vin;

    const isVinUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.vin!, SEARCH_TYPES.VIN));

    if (isTrailer) {
      this.vehicle.trailerId = this.vehicleForm.value.vrmTrm;
      const isTrailerIdUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.trailerId!, SEARCH_TYPES.TRAILER_ID));
      return isVinUnique && isTrailerIdUnique;
    } else {
      this.vehicle.vrms = [{ vrm: this.vehicleForm.value.vrmTrm, isPrimary: true }];
      const isVrmUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.getPrimaryVRM(), SEARCH_TYPES.VRM));
      return isVinUnique && isVrmUnique;
    }
  }

  private getPrimaryVRM() {
    return this.vehicle.vrms!.find(vrm => vrm.isPrimary)!.vrm;
  }
}
