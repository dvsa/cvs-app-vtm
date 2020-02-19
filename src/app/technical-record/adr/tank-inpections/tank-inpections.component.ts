import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';
import { Tank, TankDetails } from '@app/models/Tank';

@Component({
  selector: 'vtm-tank-inpections',
  templateUrl: './tank-inpections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankInpectionsComponent implements OnInit {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;
  @Input() tank: Tank;

  showTankHistory: boolean;
  tankDetails: TankDetails;

  constructor() {}

  ngOnInit() {
    this.showTankHistory =
      (this.adrDetails.vehicleDetails && this.adrDetails.vehicleDetails.type.includes('tank')) ||
      (this.adrDetails.vehicleDetails && this.adrDetails.vehicleDetails.type.includes('battery'));

    this.tankDetails = this.tank.tankDetails;
  }
}
