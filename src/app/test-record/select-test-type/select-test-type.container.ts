import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/store/state/app.state';
import {
  getActiveTechRecord,
  getFilteredTestTypeCategories,
  getTestViewState,
  selectTestType
} from '@app/store/selectors/VehicleTestResult.selectors';
import {
  CreateTestResult,
  UpdateSelectedTestResultModel
} from '@app/store/actions/VehicleTestResult.actions';
import { VIEW_STATE } from '@app/app.enums';
import { TreeData } from '@app/models/tree-data';
import { TechRecord } from '@app/models/tech-record.model';
import { TestRecordTestType } from '@app/models/test-record-test-type';

@Component({
  selector: 'vtm-select-test-type-container',
  template: `
    <ng-container *ngIf="filteredCategories$ | async as filteredCategories">
      <vtm-select-test-type
        [filteredCategories]="filteredCategories"
        [currentState]="viewState$ | async"
        [vehicleRecord]="activeRecord$ | async"
        (testTypeSelected)="updateSelectedTestResult($event)"
      >
      </vtm-select-test-type>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTestTypeContainer implements OnInit {
  testRecord$: Observable<TestRecordTestType>;
  filteredCategories$: Observable<TreeData[]>;
  viewState$: Observable<VIEW_STATE>;
  activeRecord$: Observable<TechRecord>;

  constructor(private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.testRecord$ = this.store.select(selectTestType);
    this.activeRecord$ = this.store.select(getActiveTechRecord);
    this.filteredCategories$ = this.store.select(getFilteredTestTypeCategories);
    this.viewState$ = this.store.select(getTestViewState);
  }

  updateSelectedTestResult(newTestResultData) {
    if (!!newTestResultData['key']) {
      this.store.dispatch(new UpdateSelectedTestResultModel(newTestResultData));
    } else {
      this.store.dispatch(new CreateTestResult(newTestResultData));
    }
  }
}
