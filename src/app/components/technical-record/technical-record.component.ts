import {Component, HostBinding, OnInit} from '@angular/core';
import { initAll } from 'govuk-frontend';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectSelectedVehicleTestResultModel} from '../../store/selectors/VehicleTestResultModel.selectors';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import { IAppState } from '../../store/state/app.state';
import { selectVehicleTechRecordModelHavingStatusAll } from '../../store/selectors/VehicleTechRecordModel.selectors';
import { GetVehicleTechRecordModelHavingStatusAll } from '../../store/actions/VehicleTechRecordModel.actions';

@Component({
  selector: 'app-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss']
})
export class TechnicalRecordComponent implements OnInit {
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  isLoading: boolean;
  searchIdentifier = '{none searched}';
  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;
  panelOpenState = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  panelOpenState6 = false;
  panelOpenState7 = false;
  panelOpenState8 = false;
  color = 'red';



  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch( new GetVehicleTechRecordModelHavingStatusAll(q));
    this._store.dispatch(new GetVehicleTestResultModel(q));
  }

  togglePanel() {
    this.panelOpenState  = !this.panelOpenState;
    this.panelOpenState2 = this.panelOpenState;
    this.panelOpenState3 = this.panelOpenState;
    this.panelOpenState4 = this.panelOpenState;
    this.panelOpenState5 = this.panelOpenState;
    this.panelOpenState6 = this.panelOpenState;
    this.panelOpenState7 = this.panelOpenState;
    this.panelOpenState8 = this.panelOpenState;
  }

}
