import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IAppState } from '@app/store/state/app.state';
import { getVehicleTechRecordModelError } from '@app/store/selectors/VehicleTechRecordModel.selectors';
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

  constructor(private router: Router, private store: Store<IAppState>) {
    this.searchError$ = this.store.pipe(select(getVehicleTechRecordModelError));
  }

  // public searchTechRecords(q: string) {
  //   this.isLoading = true;
  //   this.searchIdentifier = q;
  //   this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
  // }

  public searchTechRecords(searchIdentifier: string) {
    this.isLoading = true;

    if (searchIdentifier !== '' || searchIdentifier != null) {
      this.router.navigate([`/technical-record/${searchIdentifier}`]);
    }
  }
}
