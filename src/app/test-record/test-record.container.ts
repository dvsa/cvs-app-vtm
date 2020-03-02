import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import {
  getCurrentState,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResultModel.selectors';
import { ActivatedRoute } from '@angular/router';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { Preparer } from '@app/models/preparer';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultModel } from '@app/models/test-result.model';
import {
  SetCurrentState,
  UpdateTestResult
} from '@app/store/actions/VehicleTestResultModel.actions';
import { TestStation } from '@app/models/test-station';
import { getPreparers, getTestStations } from '@app/store/selectors/ReferenceData.selectors';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { SetErrorMessage } from '@app/store/actions/Error.actions';

@Component({
  selector: 'vtm-test-record-container',
  template: `
    <ng-container *ngIf="testRecordObservable$ | async as testResultObj">
      <ng-container *ngIf="!!testResultObj.testType && !!testResultObj.testRecord">
        <vtm-test-record
          [testResultObj]="testResultObj"
          [preparers]="preparers$ | async"
          [editState]="editState$ | async"
          [testStations]="testStations$ | async"
          [testTypesApplicable]="this.testTypesApplicable"
          (submitTest)="onTestSubmit($event)"
          (switchState)="currentStateHandler($event)"
          (isFormDirty)="setFormState($event)"
          (hasErrors)="setFormErrors($event)"
        >
        </vtm-test-record>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordContainer implements OnInit {
  testRecordObservable$: Observable<TestRecordTestType>;
  preparers$: Observable<Preparer[]>;
  editState$: Observable<VIEW_STATE>;
  testStations$: Observable<TestStation[]>;
  errorsInState$: Observable<string[]>;
  testTypesApplicable: TestTypesApplicable;
  isFormDirty: boolean;
  testTypeNumber: string;

  constructor(
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private testRecordMapper: TestRecordMapper
  ) {}

  ngOnInit(): void {
    this.testTypesApplicable = {
      seatBeltApplicable: this.testRecordMapper.getTestTypeApplicable('seatBeltApplicable'),
      defectsApplicable: this.testRecordMapper.getTestTypeApplicable('defectsApplicable'),
      emissionDetailsApplicable: this.testRecordMapper.getTestTypeApplicable(
        'emissionDetailsApplicable'
      ),
      testSectionApplicable1: this.testRecordMapper.getTestTypeApplicable(
        'testSectionApplicable1'
      ),
      testSectionApplicable2: this.testRecordMapper.getTestTypeApplicable(
        'testSectionApplicable2'
      )
    };

    this.route.paramMap.subscribe((params) => {
      this.testTypeNumber = params.get('id');
      this.testRecordObservable$ = this.store.select(selectTestTypeById(this.testTypeNumber));
    });
    this.preparers$ = this.store.pipe(select(getPreparers));
    this.editState$ = this.store.pipe(select(getCurrentState));
    this.testStations$ = this.store.pipe(select(getTestStations));
    this.errorsInState$ = this.store.pipe(select('error'));
  }

  onTestSubmit(testResultUpdated: TestResultModel) {
    const testResultTestTypeNumber: TestResultTestTypeNumber = {
      testResultUpdated: testResultUpdated,
      testTypeNumber: this.testTypeNumber
    };

    this.store.dispatch(new UpdateTestResult(testResultTestTypeNumber));
  }

  currentStateHandler(state: VIEW_STATE) {
    this.store.dispatch(new SetCurrentState(state));
  }

  setFormState(isFormDirty: boolean) {
    this.isFormDirty = isFormDirty;
  }

  canDeactivate(): Observable<boolean> | boolean {
    return !this.isFormDirty;
  }

  setFormErrors(errors: string[]) {
    this.store.dispatch(new SetErrorMessage(errors));
  }
}
