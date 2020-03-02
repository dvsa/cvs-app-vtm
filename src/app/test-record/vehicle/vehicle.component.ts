import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestResultModel} from '@app/models/test-result.model';

@Component({
  selector: 'vtm-vehicle',
  templateUrl: './vehicle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleComponent implements OnInit {

  @Input() testRecord: TestResultModel;

  constructor() {
  }

  ngOnInit() {
  }

}
