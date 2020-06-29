import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { VIEW_STATE } from '@app/app.enums';
import { CapitalizeString } from '@app/pipes/capitalize-string';

@Component({
  selector: 'vtm-test-section',
  templateUrl: './test-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSectionComponent implements OnInit, OnChanges {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() testTypesApplicable: TestTypesApplicable;
  @Input() editState: VIEW_STATE;
  @Output() testResult = new EventEmitter<string>();

  testResultVal: string;
  prohibitionIssue: string;
  hasCertificateNumber: boolean;

  constructor() {}

  ngOnInit() {
    this.hasCertificateNumber =
      this.testTypesApplicable.certificateApplicable[this.testType.testTypeId] ||
      (this.testTypesApplicable.specialistCertificateApplicable[this.testType.testTypeId] &&
        this.testType.testResult === 'pass');
  }
  ngOnChanges() {
    this.testResultVal =
      this.testType.testResult === 'prs'
        ? this.testType.testResult.toUpperCase()
        : new CapitalizeString().transform(this.testType.testResult);
    this.prohibitionIssue = this.testType.prohibitionIssued ? 'Yes' : 'No';
  }

  testResultHandler(tResult: string) {
    this.testResult.emit(tResult);
  }
}
