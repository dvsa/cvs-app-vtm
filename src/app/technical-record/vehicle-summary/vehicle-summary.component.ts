import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { TechRecord } from '@app/models/tech-record.model';
import { TechRecordHelpersService } from '../tech-record-helpers.service';

@Component({
  selector: 'vtm-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryComponent implements OnInit {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;

  vehicleClassDescription: string;
  isStandardVehicle: boolean;

  constructor(public techRecHelpers: TechRecordHelpersService) {}

  ngOnInit() {
    this.vehicleClassDescription =
      this.activeRecord.vehicleClass && this.activeRecord.vehicleClass.description
        ? this.activeRecord.vehicleClass.description
        : null;

    this.isStandardVehicle = this.techRecHelpers.isStandardVehicle(this.activeRecord.vehicleType);
  }

  axlesHasParkingBrakeMrk(): boolean {
    return (
      this.activeRecord.axles &&
      this.activeRecord.axles.length &&
      this.activeRecord.axles.some((x) => x.parkingBrakeMrk)
    );
  }
}
