import { Injectable } from '@angular/core';
import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
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

    // ** Until the reference data API is provisioned, return in-memory data ** //
    const mockData = this.getMockReferenceData(resourceType);

    if (mockData instanceof Error) {
      return throwError(() => mockData);
    }

    if (!resourceKey) {
      return of(mockData);
    }

    const result = mockData.find(model => model.resourceKey === resourceKey);

    return result
      ? of(result)
      : throwError(() => new Error('Reference data with specified resource key not found (404)'));
  }

  private getMockReferenceData(type: ReferenceDataResourceType): ReferenceDataModelBase[] | Error {
    switch (type) {
      case ReferenceDataResourceType.CountryOfRegistration:
        return mockCountriesOfRegistration;
      default:
        return new Error('Unknown reference data resourceType');
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
