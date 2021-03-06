import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestStation } from '@app/models/test-station';
import { ControlContainer, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { TestResultModel } from '@app/models/test-result.model';
import { TestRecordMapper } from '@app/test-record/test-record.mapper';

@Component({
  selector: 'vtm-visit-edit',
  templateUrl: './visit-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class VisitEditComponent implements OnInit {
  @Input() testRecord: TestResultModel;
  @Input() testStations: TestStation[];
  @Input() isSubmitted: boolean;

  testStationsOptions: string[];
  testStationType = '';
  testStationPNumber = '';
  testStationName = '';
  testResultChildForm: FormGroupDirective;

  constructor(private testRecordMapper: TestRecordMapper, parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.testStationType = this.testRecord.testStationType
      ? this.testRecord.testStationType.toUpperCase()
      : '';
    this.testStationPNumber = !!this.testRecord.testStationPNumber
      ? ' (' + this.testRecord.testStationPNumber + ')'
      : '';
    this.testStationName = !!this.testRecord.testStationName
      ? this.testRecord.testStationName
      : '';

    this.testResultChildForm.form.addControl(
      'testStationNameNumber',
      new FormControl(this.testStationName + ' ' + this.testStationPNumber, Validators.required)
    );
    this.testResultChildForm.form.addControl(
      'testStationType',
      new FormControl(
        {
          value: this.testRecord.testStationType
            ? this.testRecord.testStationType.toUpperCase()
            : '',
          disabled: true
        },
        Validators.required
      )
    );
    this.testResultChildForm.form.addControl(
      'testerName',
      new FormControl(this.testRecord.testerName, Validators.required)
    );
    this.testResultChildForm.form.addControl(
      'testerEmailAddress',
      new FormControl(this.testRecord.testerEmailAddress, [Validators.required, Validators.email])
    );

    this.testStationsOptions = !!this.testStations
      ? this.testStations.map(
        ({ testStationName, testStationPNumber }) =>
          `${!!testStationName ? testStationName : ''} ${
            !!testStationPNumber ? '(' + testStationPNumber + ')' : ''
          }`
      )
      : [''];

    this.testResultChildForm.form
      .get('testStationNameNumber')
      .valueChanges.subscribe((testStationVal) => {
      const testStationPNumberMatch = testStationVal.match(/\((.*)\)/);
      const testStationPNumber = !!testStationPNumberMatch ? testStationPNumberMatch.pop() : '';
      this.testStationType = this.searchTestStationType(testStationPNumber);
      this.testResultChildForm.form.get('testStationType').setValue(this.testStationType);
    });
  }

  searchTestStationType(testStationPNumber: string) {
    let testStationType;
    this.testStations.forEach(function(item) {
      if (item.testStationPNumber === testStationPNumber) {
        testStationType = item.testStationType;
      }
    });

    return this.testRecordMapper.getTestStationType(testStationType);
  }
}
