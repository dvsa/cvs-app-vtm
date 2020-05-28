import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';

import { getVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import {
  getVehicleTechRecordMetaData,
  getSelectedVehicleTechRecord,
  getViewState
} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { MetaData } from '@app/models/meta-data';
import { TechRecord } from '@app/models/tech-record.model';
import {
  SetViewState,
  UpdateVehicleTechRecord
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-technical-record-container',
  template: `
    <ng-container *ngIf="vehicleTechnicalRecord$ | async as vehicleTechRecord">
      <ng-container *ngIf="vehicleTechRecord.techRecord | FilterRecord as currentRecord">
        <vtm-technical-record
          [vehicleTechRecord]="vehicleTechRecord"
          [activeRecord]="currentRecord"
          [metaData]="metaData$ | async"
          [editState]="viewState$ | async"
          [testResultJson]="testResults$ | async"
          (submitTechRecord)="techRecordSubmissionHandler($event)"
          (changeViewState)="viewStateHandler($event)"
        >
        </vtm-technical-record>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordsContainer implements OnInit {
  vehicleTechnicalRecord$: Observable<VehicleTechRecordModel>;
  testResults$: Observable<TestResultModel[]>;
  metaData$: Observable<MetaData>;
  viewState$: Observable<VIEW_STATE>;

  constructor(private store: Store<IAppState>) {
    this.vehicleTechnicalRecord$ = this.store.select(getSelectedVehicleTechRecord);
    this.testResults$ = this.store.select(getVehicleTestResultModel);
    this.metaData$ = this.store.select(getVehicleTechRecordMetaData);
    this.viewState$ = this.store.select(getViewState);
  }

  ngOnInit(): void {}

  techRecordSubmissionHandler(editedTechRecord: TechRecord) {
    this.store.dispatch(new UpdateVehicleTechRecord(editedTechRecord));
  }

  viewStateHandler(state: VIEW_STATE) {
    this.store.dispatch(new SetViewState(state));
  }
}
