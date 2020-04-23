import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestStation } from '@app/models/test-station';
import { ControlContainer, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { TestResultModel } from '@app/models/test-result.model';
import { TestRecordMapper } from '@app/test-record/test-record.mapper';

@Component({
  selector: 'vtm-visit-edit',
  templateUrl: './visit-edit.component.html',
  styleUrls: ['./visit-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class VisitEditComponent implements OnInit {
  @Input() testRecord: TestResultModel;
  @Input() testStations: TestStation[];
  @Input() isSubmitted: boolean;

  testStationsOptions: string[];
  testStationType = '';
  testResultChildForm: FormGroupDirective;

  constructor(private testRecordMapper: TestRecordMapper, parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.testResultChildForm.form.addControl(
      'testStationNameNumber',
      new FormControl(
        this.testRecord.testStationName + ' (' + this.testRecord.testStationPNumber + ')',
        Validators.required
      )
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
      ? this.testStations.map((res) => res.testStationName + ' (' + res.testStationPNumber + ')')
      : [''];

    this.testResultChildForm.form
      .get('testStationNameNumber')
      .valueChanges.subscribe((testStationVal) => {
        const testStationPNumber =
          testStationVal !== '' ? testStationVal.match(/\((.*)\)/).pop() : '';
        this.testStationType = this.searchTestStationType(testStationPNumber);
        this.testResultChildForm.form.get('testStationType').setValue(this.testStationType);
      });
  }

  searchTestStationType(testStationPNumber: string) {
    let testStationType;
    this.testStations.forEach(function (item) {
      if (item.testStationPNumber === testStationPNumber) {
        testStationType = item.testStationType;
      }
    });

    return this.testRecordMapper.getTestStationType(testStationType);
  }
}
