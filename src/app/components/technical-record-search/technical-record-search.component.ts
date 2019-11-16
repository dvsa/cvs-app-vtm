import {Component} from '@angular/core';
import {GetVehicleTechRecordModelHavingStatusAll} from '../../store/actions/VehicleTechRecordModel.actions';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {TechRecordModel} from '../../models/tech-record.model';

@Component({
  selector: 'app-technical-record-search',
  templateUrl: './technical-record-search.component.html',
  styleUrls: ['./technical-record-search.component.scss']
})
export class TechnicalRecordSearchComponent {

  searchIdentifier = '{none searched}';
  isLoading: boolean;
  techRecords: TechRecordModel[];
  myError: { message: string } = { message : '' };
  constructor(private _store: Store<IAppState>) {
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
    this._store.dispatch(new GetVehicleTestResultModel(q));
  }

}
