import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { IAppState } from '@app/store/state/app.state';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import {
  getCreatedTestResult,
  getFilteredTestTypeCategories,
  getTestViewState,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResult.selectors';
import {
  CreateTestResult,
  UpdateSelectedTestResultModel
} from '@app/store/actions/VehicleTestResult.actions';
import { TreeData } from '@app/models/tree-data';
import { VIEW_STATE } from '@app/app.enums';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';

@Component({
  selector: 'vtm-select-test-type-container',
  template: `
    <ng-container *ngIf="filteredCategories$ | async as filteredCategories">
      <vtm-select-test-type
        [filteredCategories]="filteredCategories"
        [currentState]="viewState$ | async"
        [createdTestResult]="createdTestResult$ | async"
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
  createdTestResult$: Observable<VehicleTestResultUpdate>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.testRecord$ = this.store.select(selectTestTypeById(params.get('id')));
    });
    this.filteredCategories$ = this.store.select(getFilteredTestTypeCategories);
    this.viewState$ = this.store.select(getTestViewState);
    this.createdTestResult$ = this.store.select(getCreatedTestResult);
  }

  updateSelectedTestResult(newTestResultData) {
    if (!!newTestResultData['key']) {
      this.store.dispatch(new UpdateSelectedTestResultModel(newTestResultData));
    } else {
      this.store.dispatch(new CreateTestResult(newTestResultData));
    }
  }
}
