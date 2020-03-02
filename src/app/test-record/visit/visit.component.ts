import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestResultModel} from '@app/models/test-result.model';

@Component({
  selector: 'vtm-visit',
  templateUrl: './visit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitComponent implements OnInit {

  @Input() testRecord: TestResultModel;

  constructor() { }

  ngOnInit() {
  }

}
