import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { KeyValue } from '@angular/common';
import { v4 as uuidV4 } from 'uuid';

import { VIEW_STATE } from '@app/app.enums';
import { TreeData } from '@app/models/tree-data';
import { TestType } from '@app/models/test.type';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-select-test-type',
  templateUrl: './select-test-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTestTypeComponent implements OnInit {
  @Input() filteredCategories: TreeData[];
  @Input() currentState: VIEW_STATE;
  @Input() vehicleRecord: TechRecord;
  @Output() testTypeSelected = new EventEmitter<
    KeyValue<string, string> | VehicleTestResultUpdate
  >();
  testTypeData: KeyValue<string, string>;

  constructor() {}

  ngOnInit() {}

  selectedTestTypeHandler(testTypeData: KeyValue<string, string>) {
    this.testTypeData = testTypeData;
  }

  updateSelectedTestResult() {
    const emitData =
      this.currentState === VIEW_STATE.CREATE
        ? this.createTestResult(this.vehicleRecord)
        : this.testTypeData;
    this.testTypeSelected.emit(emitData);
  }

  createTestResult(activeRecord: TechRecord) {
    const testResultUpdate = {} as VehicleTestResultUpdate;
    return {
      msUserDetails: null,
      testResultId: this.getUUID(),
      euVehicleCategory: activeRecord.euVehicleCategory,
      testTypes: [{ testTypeId: '' } as TestType],
      ...testResultUpdate
    } as VehicleTestResultUpdate;
  }

  getUUID() {
    return uuidV4();
  }
}
