import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { KeyValue } from '@angular/common';
import { TreeData } from '@app/models/tree-data';

@Component({
  selector: 'vtm-select-test-type',
  templateUrl: './select-test-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTestTypeComponent implements OnInit {
  @Input() filteredCategories: TreeData[];
  @Output() testTypeSelected = new EventEmitter<KeyValue<string, string>>();
  testTypeData: KeyValue<string, string>;

  constructor() {}

  ngOnInit() {}

  selectedTestTypeHandler(testTypeData: KeyValue<string, string>) {
    this.testTypeData = testTypeData;
  }

  updateSelectedTestResult() {
    this.testTypeSelected.emit(this.testTypeData);
  }
}
