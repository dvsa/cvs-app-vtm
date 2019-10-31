import { Component, OnInit } from '@angular/core';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import {IAppState} from '../../store/state/app.state';
import {GetVehicleTechRecordModelHavingStatusAll} from '../../store/actions/VehicleTechRecordModel.actions';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-technical-record-searchbar',
  templateUrl: './technical-record-searchbar.component.html',
  styleUrls: ['./technical-record-searchbar.component.scss']
})

export class TechnicalRecordSearchbarComponent implements OnInit {

  searchIdentifier = '{none searched}';
  isLoading: boolean;

  constructor(private _store: Store<IAppState>) { }

  ngOnInit() {
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
    this._store.dispatch(new GetVehicleTestResultModel(q));
  }

}
