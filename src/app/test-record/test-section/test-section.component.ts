import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

@Component({
  selector: 'vtm-test-section',
  templateUrl: './test-section.component.html',
  styleUrls: ['./test-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSectionComponent implements OnInit {

  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() applicableTestTypeIds1: {};
  @Input() applicableTestTypeIds2: {};

  constructor() {
  }

  ngOnInit() {}

}

