import { Component, OnInit } from '@angular/core';
import { TechnicalRecordService } from './technical-record.service';
import { finalize } from 'rxjs/operators';
import { TechnicalRecordModel, Axle } from './technical-record.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VehicleNotFoundDialogComponent} from '@app/vehicle-not-found-dialog/vehicle-not-found-dialog.component';
import { Radios } from 'govuk-frontend';
import { Table } from 'govuk-frontend';
import {accordian} from 'govuk-frontend';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { initAll } from 'govuk-frontend';
import {IAppState} from '@app/store/state/app.state';
import {Store} from '@ngrx/store';
import {GetVehicleTechRecordModel, GetVehicleTechRecordModelHavingStatusAll} from '@app/store/actions/VehicleTechRecordModel.actions';
import {select} from '@ngrx/core';
import {selectVehicleTechRecordModelHavingStatusAll} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import {Observable} from 'rxjs';
import {selectSelectedVehicleTestResultModel} from '@app/store/selectors/VehicleTestResultModel.selectors';
import {GetVehicleTestResultModel} from '@app/store/actions/VehicleTestResultModel.actions';

@Component({
  selector: 'app-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss']
})
export class TechnicalRecordComponent implements OnInit {
  isLoading: boolean;
  searchIdentifier = '{none searched}';
  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;

  constructor(private _store: Store<IAppState>, private techRecordService: TechnicalRecordService, public matDialog: MatDialog) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTestResultModel(q));
    this._store.dispatch( new GetVehicleTechRecordModelHavingStatusAll(q));
    // this._store.dispatch(new GetVehicleTestResultModel(q));
  }
}
