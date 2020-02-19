import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';

import { selectSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import {
  selectVehicleTechRecordModelHavingStatusAll,
  getVehicleTechRecordAdrMetaData
} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { MetaData } from '@app/models/meta-data';
import { TechRecord } from '@app/models/tech-record.model';
import { UpdateVehicleTechRecord } from '@app/store/actions/VehicleTechRecordModel.actions';

@Component({
  selector: 'vtm-technical-record-container',
  template: `
    <ng-container *ngIf="techRecordsJson$ | async as techRecordsJson">
      <ng-container *ngIf="techRecordsJson[0].techRecord | FilterRecord as activeRecord">
        <vtm-technical-record
          [techRecordsJson]="techRecordsJson"
          [activeRecord]="activeRecord"
          [metaData]="metaData$ | async"
          [testResultJson]="testResultJson$ | async"
          (submitTechRecord)="onTechRecordSubmission($event)"
        >
        </vtm-technical-record>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordsContainer implements OnInit {
  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;
  metaData$: Observable<MetaData>;

  constructor(private store: Store<IAppState>) {
    this.techRecordsJson$ = this.store.pipe(select(selectVehicleTechRecordModelHavingStatusAll));
    this.testResultJson$ = this.store.pipe(select(selectSelectedVehicleTestResultModel));
    this.metaData$ = this.store.pipe(select(getVehicleTechRecordAdrMetaData));
  }

  ngOnInit(): void {}

  onTechRecordSubmission(editedTechRecord: TechRecord) {
    console.log(editedTechRecord);
    this.store.dispatch(new UpdateVehicleTechRecord(editedTechRecord));
  }
}
