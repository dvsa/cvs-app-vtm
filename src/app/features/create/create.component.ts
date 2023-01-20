import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiOptions } from '@forms/models/options.model';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent {
  private vehicle: Partial<VehicleTechRecordModel> = {};

  private isVinUnique: boolean = false;
  private isVrmUnique: boolean = false;
  private isTrailerIdUnique: boolean = false;

  vehicleForm = new FormGroup({
    vin: new FormControl('', [Validators.minLength(3), Validators.maxLength(21), Validators.required]),
    vrmTrm: new FormControl('', [Validators.minLength(1), Validators.maxLength(9), Validators.required]),
    vehicleType: new FormControl('')
  });

  constructor(
    private technicalRecordService: TechnicalRecordService,
    private route: ActivatedRoute,
    private router: Router,
    private dfs: DynamicFormService
  ) {}
  get vehicleTypeOptions(): MultiOptions {
    return [
      { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
      { label: 'Light goods vehicle (LGV)', value: VehicleTypes.LGV },
      { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
      { label: 'Trailer (TRL)', value: VehicleTypes.TRL }
    ];
  }

  handleSubmit() {
    this.vehicle.vin = this.vehicleForm.value.vin;
    this.vehicle.vrms = [{ vrm: this.vehicleForm.value.vrmTrm, isPrimary: true }];
    this.vehicle.trailerId = this.vehicleForm.value.vrmTrm;

    if (this.areValuesUnique()) {
      this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
    }
    console.log('error');
  }

  private areValuesUnique() {
    const isTrailer = this.vehicleForm.value.vehicleType === VehicleTypes.TRL;

    this.technicalRecordService.isUnique(this.vehicle.vin!, SEARCH_TYPES.VIN).subscribe(data => (this.isVinUnique = data));

    isTrailer
      ? this.technicalRecordService.isUnique(this.vehicle.trailerId!, SEARCH_TYPES.TRAILER_ID).subscribe(data => (this.isTrailerIdUnique = data))
      : this.technicalRecordService.isUnique(this.getPrimaryVRM(), SEARCH_TYPES.VRM).subscribe(data => (this.isVrmUnique = data));

    return isTrailer ? this.isVinUnique && this.isTrailerIdUnique : this.isVinUnique && this.isVrmUnique;
  }

  private getPrimaryVRM() {
    return this.vehicle.vrms!.find(vrm => vrm.isPrimary)!.vrm;
  }
}
