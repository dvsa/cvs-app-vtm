import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { KeyValue } from '@angular/common';

import { VIEW_STATE } from '@app/app.enums';
import { TreeData } from '@app/models/tree-data';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';

@Component({
  selector: 'vtm-select-test-type',
  templateUrl: './select-test-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTestTypeComponent implements OnInit {
  @Input() filteredCategories: TreeData[];
  @Output() testTypeSelected = new EventEmitter<
    KeyValue<string, string> | VehicleTestResultUpdate
  >();
  @Input() currentState: VIEW_STATE;
  @Input() createdTestResult: VehicleTestResultUpdate;
  testTypeData: KeyValue<string, string>;

  constructor() {}

  ngOnInit() {}

  selectedTestTypeHandler(testTypeData: KeyValue<string, string>) {
    this.testTypeData = testTypeData;
  }

  updateSelectedTestResult() {
    const emitData =
      this.currentState === VIEW_STATE.CREATE ? this.createdTestResult : this.testTypeData;
    this.testTypeSelected.emit(emitData);
  }
}
