import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';
import { VEHICLE_TYPES } from '@app/app.enums';

@Component({
  selector: 'vtm-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryComponent implements OnInit {
  @Input() activeRecord: TechRecord;
  vehicleClassDescription = '-';
  constructor() {}

  ngOnInit() {
    this.vehicleClassDescription =
      this.activeRecord.vehicleClass && this.activeRecord.vehicleClass.description
        ? this.formatVehicleClassDescription()
        : '-';
  }

  axlesHasParkingBrakeMrk(): boolean {
    return (
      this.activeRecord.axles &&
      this.activeRecord.axles.length &&
      this.activeRecord.axles.some((x) => x.parkingBrakeMrk)
    );
  }

  formatVehicleClassDescription() {
    return (
      this.activeRecord.vehicleClass.description.charAt(0).toUpperCase() +
      this.activeRecord.vehicleClass.description.substr(1).toLowerCase()
    );
  }

  isStandardVehicle(vehicleType: string): boolean {
    return (
      VEHICLE_TYPES.HGV === vehicleType ||
      VEHICLE_TYPES.TRL === vehicleType ||
      VEHICLE_TYPES.PSV === vehicleType
    );
  }
}
