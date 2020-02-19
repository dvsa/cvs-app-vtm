import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';

import { selectSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import {
  selectVehicleTechRecordModelHavingStatusAll,
  getVehicleTechRecordAdrMetaData, getSelectedVehicleTechRecord
} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { MetaData } from '@app/models/meta-data';
import { TechRecord } from '@app/models/tech-record.model';
import { UpdateVehicleTechRecord } from '@app/store/actions/VehicleTechRecordModel.actions';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vtm-technical-record-container',
  template: `
<!--    <ng-container *ngIf="techRecordsJson$ | async as techRecordsJson">-->
    <ng-container *ngIf="(vehicleTechnicalRecord$ | async) as  vTechRecord">
      <ng-container *ngIf="vTechRecord.techRecord | FilterRecord as activeRecord">
        <vtm-technical-record
          [vehicleTechRecord]="vTechRecord"
          [activeRecord]="activeRecord"
          [metaData]="metaData$ | async"
          [testResultJson]="testResultJson$ | async"
          (submitTechRecord)="onTechRecordSubmission($event)"
        >
        </vtm-technical-record>
      </ng-container>
    </ng-container>
<!--    </ng-container>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordsContainer implements OnInit {
  // techRecordsJson$: Observable<VehicleTechRecordModel[]>;
  vehicleTechnicalRecord$: Observable<VehicleTechRecordModel>;
  testResultJson$: Observable<TestResultModel>;
  metaData$: Observable<MetaData>;
  techRecordNumber: string;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute) {
    // this.techRecordsJson$ = this.store.pipe(select(selectVehicleTechRecordModelHavingStatusAll));
    this.vehicleTechnicalRecord$ = this.store.pipe((select(getSelectedVehicleTechRecord)));
    this.testResultJson$ = this.store.pipe(select(selectSelectedVehicleTestResultModel));
    this.metaData$ = this.store.pipe(select(getVehicleTechRecordAdrMetaData));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.techRecordNumber = params.get('id');
    });
  }

  onTechRecordSubmission(editedTechRecord: TechRecord) {
    console.log(editedTechRecord);
    this.store.dispatch(new UpdateVehicleTechRecord(editedTechRecord));
  }
}
