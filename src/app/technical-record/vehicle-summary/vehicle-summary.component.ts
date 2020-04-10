import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  styleUrls: ['./vehicle-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryComponent implements OnInit {
  @Input() activeRecord: any;

  constructor(public techRecHelpers: TechRecordHelpersService) {}

  ngOnInit() {}

  axlesHasNoParkingBrakeMrk(axles): boolean {
    let baxlesHasNoParkingBrakeMrk = true;
    axles.forEach((axle) => {
      if (axle.parkingBrakeMrk === true) {
        baxlesHasNoParkingBrakeMrk = false;
      }
    });
    return baxlesHasNoParkingBrakeMrk;
  }
}
