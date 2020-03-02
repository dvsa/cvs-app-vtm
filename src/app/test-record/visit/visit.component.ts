import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestResultModel} from '@app/models/test-result.model';
import {VIEW_STATE} from '@app/app.enums';
import {TestStation} from '@app/models/test-station';

@Component({
  selector: 'vtm-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitComponent implements OnInit {

  @Input() testRecord: TestResultModel;
  @Input() editState: VIEW_STATE;
  @Input() testStations: TestStation[];

  constructor() { }

  ngOnInit() {
  }

}
