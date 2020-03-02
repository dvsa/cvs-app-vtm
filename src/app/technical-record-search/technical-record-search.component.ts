import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '@app/store/state/app.state';
import { GetVehicleTechRecordModelHavingStatusAll } from '@app/store/actions/VehicleTechRecordModel.actions';

@Component({
  selector: 'vtm-technical-record-search',
  templateUrl: './technical-record-search.component.html',
  styleUrls: ['./technical-record-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordSearchComponent {

  searchIdentifier = '{none searched}';
  isLoading: boolean;
  searchError$: Observable<any>;

  constructor(private _store: Store<IAppState>) {
    this.searchError$ = this._store.select(s => s.vehicleTechRecordModel.error);
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
  }

}
