import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestStation } from '@app/models/test-station';
import { ControlContainer, FormControl, FormGroupDirective } from '@angular/forms';
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
  testStationsOptions: string[];
  testerEmailAddresses: string[] = [];
  testerEmail = '';
  testStationType = '';
  testResultChildForm: FormGroupDirective;

  constructor(private testRecordMapper: TestRecordMapper, parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.testResultChildForm.form.addControl(
      'testStationNameNumber',
      new FormControl(this.testRecord.testStationName + ' (' + this.testRecord.testStationPNumber + ')')
    );
    this.testResultChildForm.form.addControl(
      'testStationType',
      new FormControl({ value: this.testRecord.testStationType, disabled: true })
    );
    this.testResultChildForm.form.addControl(
      'testerName',
      new FormControl(this.testRecord.testerName)
    );
    this.testResultChildForm.form.addControl(
      'testerEmailAddress',
      new FormControl({ value: this.testRecord.testerEmailAddress, disabled: true })
    );

    // TODO: Functionality commented until AC17 & AC16 are decided

    // this.testStationsOptions = !!this.testStations ? this.testStations.map(
    //   (res) => res.testStationName + ' (' + res.testStationPNumber + ')'
    // ) : [''];

    // if (!!this.testStations) {
    //   this.testStations.map((res) =>
    //     res.testStationEmails.map((res2) => this.testerEmailAddresses.push(res2))
    //   );
    // }

    // this.testResultChildForm.form.get('testerName').valueChanges.subscribe((testerNameVal) => {
    //   this.testerEmail = this.searchFromArray(this.testerEmailAddresses, testerNameVal);
    //   this.testResultChildForm.form.get('testerEmailAddress').setValue(this.testerEmail);
    // });

    // this.testResultChildForm.form
    //   .get('testStationNameNumber')
    //   .valueChanges.subscribe((testStationVal) => {
    //     const testStationPNumber = !!testStationVal ? testStationVal.match(/\((.*)\)/).pop() : '';
    //     this.testStationType = this.searchTestStationType(testStationPNumber);
    //     console.log(this.testStationType);
    //     this.testResultChildForm.form.get('testStationType').setValue(this.testStationType);
    //   });
  }

  // searchTestStationType(testStationPNumber: string) {
  //   console.log(this.testStations);
  //   let testStationType;
  //   this.testStations.forEach(function (item) {
  //     if (item.testStationPNumber === testStationPNumber) {
  //       testStationType = item.testStationType;
  //     }
  //   });
  //
  //   return this.testRecordMapper.getTestStationType(testStationType);
  // }

  // searchFromArray(arr, regex) {
  //   const matches = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     if (arr[i].match(regex.replace(/\s/g, '.'))) {
  //       matches.push(arr[i]);
  //     }
  //   }
  //   return matches[0];
  // }
}
