import { Injectable } from '@angular/core';
import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { select, Store } from '@ngrx/store';
import {
  fetchReferenceData,
  ReferenceDataState,
  selectAllReferenceDataByResourceType,
  selectReferenceDataByResourceKey
} from '@store/reference-data';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  constructor(private store: Store<ReferenceDataState>) {}

  fetchReferenceData(
    resourceType: ReferenceDataResourceType,
    resourceKey?: string
  ): Observable<Array<ReferenceDataModelBase> | ReferenceDataModelBase> {
    if (!resourceType) {
      return throwError(() => new Error('Reference data resourceType is required'));
    }

    // ** Until the reference data API is provisioned, return an in-memory data ** //
    switch (resourceType) {
      case ReferenceDataResourceType.CountryOfRegistration:
        if (resourceKey) {
          const result = mockCountriesOfRegistration.find((c) => c.resourceKey === resourceKey);
          if (result) {
            return of(result);
          } else {
            return throwError(() => new Error('Reference data with specified resource key not found (404)'));
          }
        }
        return of(mockCountriesOfRegistration);
      default:
        return throwError(() => new Error('Unknown reference data resourceType'));
    }
  }

  loadReferenceData(resourceType: ReferenceDataResourceType): void {
    this.store.dispatch(fetchReferenceData({ resourceType }));
  }

  getAll$ = (resourceType: ReferenceDataResourceType) => {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(resourceType)));
  };

  getByKey$ = (resourceType: ReferenceDataResourceType, resourceKey: string) => {
    return this.store.pipe(select(selectReferenceDataByResourceKey(resourceType, resourceKey)));
  };
}
