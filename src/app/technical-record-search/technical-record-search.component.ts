import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '@app/store/state/app.state';
import { GetVehicleTechRecordModelHavingStatusAll } from '@app/store/actions/VehicleTechRecordModel.actions';
import { SEARCH_CRITERIA } from '@app/app.enums';


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
  searchCriteriaOptions = Object.values(SEARCH_CRITERIA);
  searchCriteria = 'all';

  constructor(private _store: Store<IAppState>) {
    this.searchError$ = this._store.select(s => s.vehicleTechRecordModel.error);
  }

  public searchTechRecords(searchIdentifier: string, searchCriteria: string) {

    this.isLoading = true;
    this.searchIdentifier = searchIdentifier;

    switch (searchCriteria) {
      case SEARCH_CRITERIA.VRM_CRITERIA:
        this.searchCriteria = 'vrm';
        break;
      case SEARCH_CRITERIA.FULL_VIN_CRITERIA:
        this.searchCriteria = 'vin';
        break;
      case SEARCH_CRITERIA.PARTIAL_VIN_CRITERIA:
        this.searchCriteria = 'partialVin';
        break;
      case SEARCH_CRITERIA.TRL_CRITERIA:
        this.searchCriteria = 'trailerId';
        break;
      case SEARCH_CRITERIA.ALL_CRITERIA:
      default:
        this.searchCriteria = 'all';
    }

    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll([this.searchIdentifier, this.searchCriteria]));
  }

}
