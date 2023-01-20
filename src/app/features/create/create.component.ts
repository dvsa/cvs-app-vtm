import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiOptions } from '@forms/models/options.model';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
  private vehicle: Partial<VehicleTechRecordModel> = {};

  private isVinUnique: boolean = true;
  private isVrmUnique: boolean = true;
  private isTrailerIdUnique: boolean = true;

  #selectVehicleType: VehicleTypes = VehicleTypes.PSV;
  #inputVin: string = '';
  #inputVrmOrTrailerId: string = '';

  constructor(private technicalRecordService: TechnicalRecordService, private route: ActivatedRoute, private router: Router) {}
  get vehicleTypeOptions(): MultiOptions {
    return [
      { label: 'Heavy goods vehicle (HGV)', value: 'hgv' },
      { label: 'Light goods vehicle (LGV)', value: 'lgv' },
      { label: 'Public service vehicle (PSV)', value: 'psv' },
      { label: 'Trailer (TRL)', value: 'trl' }
    ];
  }
  ngOnInit(): void {
    console.log('create init');
  }
  handleSubmit() {
    this.vehicle.vin = this.#inputVin;
    this.vehicle.vrms = [{ vrm: this.#inputVrmOrTrailerId, isPrimary: true }];
    this.vehicle.trailerId = this.#inputVrmOrTrailerId;

    if (this.areValuesUnique()) {
      this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
    }
    console.log('error');
  }

  private areValuesUnique() {
    const isTrailer = this.#selectVehicleType == VehicleTypes.TRL;

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
