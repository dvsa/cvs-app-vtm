import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {TestResultModel} from '@app/models/test-result.model';

@Component({
  selector: 'vtm-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleComponent implements OnInit {

  @Input() testRecord: TestResultModel;

  constructor(public techRecHelpers: TechRecordHelpersService) {
  }

  ngOnInit() {
  }

}
