import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';

import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { SetSelectedVehicleTechnicalRecord } from '@app/store/actions/VehicleTechRecordModel.actions';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-multiple-records-container',
  template: `
    <ng-container *ngIf="vehicleTechRecords$ | async as vehicleTechRecords">
      <vtm-multiple-records
        [vehicleTechRecords]="vehicleTechRecords"
        (setVehicleTechRecord)="onSetSelectedVehicleTechRecord($event)"
      >
      </vtm-multiple-records>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleRecordsContainer implements OnInit {
  vehicleTechRecords$: Observable<VehicleTechRecordModel[]>;

  constructor(private store: Store<IAppState>) {
    this.vehicleTechRecords$ = this.store.select(selectVehicleTechRecordModelHavingStatusAll);
  }

  ngOnInit(): void {}

  onSetSelectedVehicleTechRecord(vehicleTechRecord: VehicleTechRecordModel) {
    this.store.dispatch(
      new SetSelectedVehicleTechnicalRecord({
        vehicleRecord: vehicleTechRecord,
        viewState: VIEW_STATE.VIEW_ONLY
      })
    );
  }
}
