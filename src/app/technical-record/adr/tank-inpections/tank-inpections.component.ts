import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';
import { TankDetails } from '@app/models/Tank';

@Component({
  selector: 'vtm-tank-inpections',
  templateUrl: './tank-inpections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankInpectionsComponent implements OnChanges {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  showTankHistory: boolean;
  tankDetails: TankDetails;

  constructor() {}

  ngOnChanges(): void {
    const { vehicleDetails } = this.adrDetails;
    this.showTankHistory =
      (vehicleDetails && vehicleDetails.type.includes('tank')) ||
      (vehicleDetails && vehicleDetails.type.includes('battery'));

    const { tank } = this.adrDetails;
    this.tankDetails = tank && tank.tankDetails ? tank.tankDetails : undefined;
  }
}
