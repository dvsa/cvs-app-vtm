import { Injectable } from '@angular/core';
import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { select, Store } from '@ngrx/store';
import { fetchReferenceData, ReferenceDataState, selectAllCountriesOfRegistration } from '@store/reference-data';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  constructor(private store: Store<ReferenceDataState>) {}

  fetchReferenceDataByType(resourceType: ReferenceDataResourceType): Observable<Array<ReferenceDataModelBase>> {
    if (!resourceType) {
      return throwError(() => new Error('Reference data resourceType is required'));
    }

    // ** Until the reference data service is provisioned, return an in-memory collection ** //
    switch (resourceType) {
      case ReferenceDataResourceType.CountryOfRegistration:
        return of(mockCountriesOfRegistration);
      default:
        return throwError(() => new Error('Unknown feference data resourceType'));
    }
  }

  loadReferenceData(resourceType: ReferenceDataResourceType): void {
    this.store.dispatch(fetchReferenceData({ resourceType }));
  }

  get countriesOfRegistration$() {
    return this.store.pipe(select(selectAllCountriesOfRegistration));
  }
}
