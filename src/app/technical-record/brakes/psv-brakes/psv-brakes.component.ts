import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Brakes } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-psv-brakes',
  templateUrl: './psv-brakes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsvBrakesComponent implements OnInit {

  @Input() brakes: Brakes;
  
  constructor() { }

  ngOnInit() {
    console.log(this.brakes);
  }

}
