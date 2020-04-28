import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

import { Tank } from '@app/models/Tank';
import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-tank-details',
  templateUrl: './tank-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankDetailsComponent implements OnChanges {
  tank: Tank;
  vehicleType: string;

  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  constructor() {}

  ngOnChanges(): void {
    this.tank = this.adrDetails.tank;

    const { vehicleDetails } = this.adrDetails;
    this.vehicleType = vehicleDetails && vehicleDetails.type ? vehicleDetails.type : '';
  }
}
