import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';
import { initAll } from 'govuk-frontend';

@Component({
  selector: 'vtm-test-record',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit {
  @Input() testRecord: TestResultModel;
  @Input() testType: TestType;
  @Input() testTypeNumber: string;
  @Input() seatBeltApplicable: {};
  @Input() emissionDetailsApplicable: {};
  @Input() defectsApplicable: {};
  @Input() testSectionApplicable1: {};
  @Input() testSectionApplicable2: {};

  hasDefectsApplicable: boolean;
  hasEmissionApplicable: boolean;
  hasSeatBeltApplicable: boolean;

  constructor() {}

  ngOnInit(): void {
    this.hasDefectsApplicable = this.defectsApplicable[this.testType.testTypeId];
    this.hasSeatBeltApplicable =
      !this.seatBeltApplicable[this.testType.testTypeId] &&
      !(this.testRecord.vehicleType === 'psv');
    this.hasEmissionApplicable =
      !this.emissionDetailsApplicable[this.testType.testTypeId] &&
      (!(this.testRecord.vehicleType === 'psv') ||
        !(this.testRecord.vehicleType.toString() === 'hgv')) &&
      this.testType.testResult !== 'pass';

    initAll();
  }

  goBack() {
    window.history.back();
  }
}
