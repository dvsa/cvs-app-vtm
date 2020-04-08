import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IAppState } from '@app/store/state/app.state';
import { selectSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import {
  getVehicleTechRecordMetaData,
  getSelectedVehicleTechRecord,
  getViewState,
  getTechRecord
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
      <div class="govuk-width-container">
        <a class="govuk-back-link" vtmBackButton>Back</a>

        <main class="govuk-main-wrapper">
          <vtm-technical-record
            [vehicleTechRecord]="vehicleTechRecord"
            [activeRecord]="activeTechRecord$ | async"
            [metaData]="metaData$ | async"
            [editState]="viewState$ | async"
            [canEdit]="canEdit$ | async"
            [testResultJson]="testResults$ | async"
            (submitTechRecord)="techRecordSubmissionHandler($event)"
            (changeViewState)="viewStateHandler($event)"
          >
          </vtm-technical-record>
        </main>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordsContainer implements OnInit {
  vehicleTechnicalRecord$: Observable<VehicleTechRecordModel>;
  activeTechRecord$: Observable<TechRecord>;
  testResults$: Observable<TestResultModel>;
  metaData$: Observable<MetaData>;
  viewState$: Observable<VIEW_STATE>;
  createState$ = of(0);
  canEdit$: Observable<boolean>;

  constructor(private store: Store<IAppState>) {
    this.vehicleTechnicalRecord$ = this.store.select(getSelectedVehicleTechRecord);
    this.activeTechRecord$ = this.store.select(getTechRecord).pipe(map((f) => f()));
    this.testResults$ = this.store.select(selectSelectedVehicleTestResultModel);
    this.metaData$ = this.store.select(getVehicleTechRecordMetaData);
    this.viewState$ = this.store.select(getViewState);
  }

  ngOnInit(): void {
    this.canEdit$ = combineLatest([this.viewState$, this.createState$]).pipe(
      map(([viewState, createState]) => createState as any /*|| viewState*/)
      // TODO: Uncomment during Tech Edit Ticket
    );
  }

  techRecordSubmissionHandler(editedTechRecord: TechRecord) {
    this.store.dispatch(new UpdateVehicleTechRecord(editedTechRecord));
  }

  viewStateHandler(state: VIEW_STATE) {
    this.store.dispatch(new SetViewState(state));
  }
}
