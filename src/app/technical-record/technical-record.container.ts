import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAppState } from '@app/store/state/app.state';
import {
  getVehicleTechRecordMetaData,
  getSelectedVehicleTechRecord,
  getTechViewState,
  getActiveVehicleTechRecord
} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { getVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import { MetaData } from '@app/models/meta-data';
import {
  SetViewState,
  CreateVehicleTechRecord,
  UpdateVehicleTechRecord
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit,
  VehicleTechRecordEditState
} from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-technical-record-container',
  template: `
    <ng-container *ngIf="vehicleTechnicalRecord$ | async as vehicleTechRecord">
      <div class="govuk-width-container">
        <a class="govuk-back-link" vtmBackButton>Back</a>

        <main class="govuk-main-wrapper">
          <vtm-technical-record
            [activeVehicleTechRecord]="activeVehicleTechRecord$ | async"
            [vehicleTechRecord]="vehicleTechRecord"
            [metaData]="metaData$ | async"
            [currentState]="viewState$ | async"
            [testResultJson]="testResults$ | async"
            (submitVehicleRecord)="vehicleRecordSubmissionHandler($event)"
            (changeViewState)="viewStateHandler($event)"
            (sendPlates)="sendPlatesHandler($event)"
          >
          </vtm-technical-record>
        </main>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordsContainer implements OnInit {
  activeVehicleTechRecord$: Observable<VehicleTechRecordEdit>;
  vehicleTechnicalRecord$: Observable<VehicleTechRecordModel>;
  testResults$: Observable<TestResultModel[]>;
  metaData$: Observable<MetaData>;
  viewState$: Observable<VIEW_STATE>;

  constructor(private store: Store<IAppState>) {
    this.activeVehicleTechRecord$ = this.store
      .select(getActiveVehicleTechRecord)
      .pipe(map((f) => f()));
    this.vehicleTechnicalRecord$ = this.store.select(getSelectedVehicleTechRecord);
    this.testResults$ = this.store.select(getVehicleTestResultModel);
    this.metaData$ = this.store.select(getVehicleTechRecordMetaData);
    this.viewState$ = this.store.select(getTechViewState);
  }

  ngOnInit(): void {}

  vehicleRecordSubmissionHandler(editedVehicleRecordState: VehicleTechRecordEditState): void {
    const { vehicleRecordEdit, viewState } = editedVehicleRecordState;

    viewState === VIEW_STATE.CREATE
      ? this.store.dispatch(new CreateVehicleTechRecord(vehicleRecordEdit))
      : this.store.dispatch(new UpdateVehicleTechRecord(vehicleRecordEdit));
  }

  viewStateHandler(state: VIEW_STATE): void {
    this.store.dispatch(new SetViewState(state));
  }

  sendPlatesHandler(editedVehicleRecord: VehicleTechRecordEdit) {
    this.store.dispatch(new UpdateVehicleTechRecord(editedVehicleRecord));
  }
}
