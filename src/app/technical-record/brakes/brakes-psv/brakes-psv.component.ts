import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Brakes } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-brakes-psv',
  templateUrl: './brakes-psv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrakesPsvComponent implements OnInit {

  @Input() brakes: Brakes;
  
  constructor() { }

  ngOnInit() { }

}
