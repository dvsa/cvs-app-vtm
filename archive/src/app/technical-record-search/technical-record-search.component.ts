import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IAppState } from '@app/store/state/app.state';
import { getErrors } from '@app/store/selectors/error.selectors';
import { GetVehicleTechRecordHavingStatusAll } from '@app/store/actions/VehicleTechRecordModel.actions';
import { SEARCH_CRITERIA } from '@app/app.enums';
import { SearchParams } from '@app/models/search-params';

@Component({
  selector: 'vtm-technical-record-search',
  templateUrl: './technical-record-search.component.html',
  styleUrls: ['./technical-record-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordSearchComponent implements OnInit {
  isLoading: boolean;
  searchError$: Observable<string[]>;
  searchCriteriaOptions = Object.values(SEARCH_CRITERIA);
  searchParams: SearchParams = { searchIdentifier: '{none searched}', searchCriteria: 'all' };

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {
    this.searchError$ = this.store.select(getErrors);
  }

  public searchTechRecords(searchIdentifier: string, searchCriteria: string) {
    this.isLoading = true;
    this.searchParams.searchIdentifier = encodeURIComponent(searchIdentifier);

    switch (searchCriteria) {
      case SEARCH_CRITERIA.VRM_CRITERIA:
        this.searchParams.searchCriteria = 'vrm';
        break;
      case SEARCH_CRITERIA.FULL_VIN_CRITERIA:
        this.searchParams.searchCriteria = 'vin';
        break;
      case SEARCH_CRITERIA.PARTIAL_VIN_CRITERIA:
        this.searchParams.searchCriteria = 'partialVin';
        break;
      case SEARCH_CRITERIA.TRL_CRITERIA:
        this.searchParams.searchCriteria = 'trailerId';
        break;
      case SEARCH_CRITERIA.ALL_CRITERIA:
      default:
        this.searchParams.searchCriteria = 'all';
    }

    this.store.dispatch(new GetVehicleTechRecordHavingStatusAll(this.searchParams));
  }
}
