import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Axle } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-axle-brakes',
  templateUrl: './axle-brakes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AxleBrakesComponent implements OnInit {

  @Input() vehicleType: string;
  @Input() axle: Axle;
  constructor() { }

  ngOnInit() {
  }
}
