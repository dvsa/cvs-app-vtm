import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  styleUrls: ['./vehicle-summary.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryComponent implements OnInit {

  @Input() activeRecord: any;

  constructor(public techRecHelpers: TechRecordHelpersService) { }

  ngOnInit() {
  }

  public axlesHasNoParkingBrakeMrk(axles) {
    let baxlesHasNoParkingBrakeMrk = true;
    axles.forEach(axle => {
      if (axle.parkingBrakeMrk === true) {
        baxlesHasNoParkingBrakeMrk = false;
      }
    });
    return baxlesHasNoParkingBrakeMrk;
  }

}
