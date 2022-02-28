import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import {
  getFilteredTestTypeCategories,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResultModel.selectors';
import { UpdateSelectedTestResultModel } from '@app/store/actions/VehicleTestResultModel.actions';
import { KeyValue } from '@angular/common';
import { TreeData } from '@app/models/tree-data';

@Component({
  selector: 'vtm-select-test-type-container',
  template: `
    <ng-container *ngIf="filteredCategories$ | async as filteredCategories">
      <vtm-select-test-type
        [filteredCategories]="filteredCategories"
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

  constructor(private store: Store<IAppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.testRecord$ = this.store.select(selectTestTypeById(params.get('id')));
    });
    this.filteredCategories$ = this.store.select(getFilteredTestTypeCategories);
  }

  updateSelectedTestResult(newTestTypeData: KeyValue<string, string>) {
    this.store.dispatch(new UpdateSelectedTestResultModel(newTestTypeData));
  }
}
