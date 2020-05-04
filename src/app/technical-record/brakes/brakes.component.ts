import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { VEHICLE_TYPES } from '@app/app.enums';
import { Brakes, Axle } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-brakes',
  templateUrl: './brakes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrakesComponent implements OnInit {

  @Input() currentVehicleType: string;
  @Input() brakes: Brakes;
  @Input() axles: Axle[];

  constructor() { }

  ngOnInit() {

  }

}
