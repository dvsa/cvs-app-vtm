import { Injectable } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import { mockBodyMakes } from '@mocks/reference-data/mock-body-makes';
import { mockBodyModels } from '@mocks/reference-data/mock-body-models';
import { mockBrakes } from '@mocks/reference-data/mock-brakes';
import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { mockTyres } from '@mocks/reference-data/mock-tyres';
import { mockPsvMakes } from '@mocks/reference-data/mock-psv-make.reference-data';
import { mockReasonsForAbandoningHgv } from '@mocks/reference-data/mock-hgv-reasons-for-abandoning.reference-data';
import { mockReasonsForAbandoningPsv } from '@mocks/reference-data/mock-psv-reasons-for-abandoning.reference-data';
import { mockSpecialistSpecialistReasonsForAbandoning } from '@mocks/reference-data/mock-specialist-reasons-for-abandoning.reference-data';
import { mockTIRReasonsForAbandoning } from '@mocks/reference-data/mock-TIR-reasons-for-abandoning.reference-data';
import { mockReasonsForAbandoningTrl } from '@mocks/reference-data/mock-trl-reasons-for-abandoning.reference-data';
import { mockUsers } from '@mocks/reference-data/mock-user.reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import {
  fetchReferenceData,
  ReferenceDataState,
  selectAllReferenceDataByResourceType,
  selectReasonsForAbandoning,
  selectReferenceDataByResourceKey
} from '@store/reference-data';
import { map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  constructor(private store: Store<ReferenceDataState>) {}

  fetchReferenceData(
    resourceType: ReferenceDataResourceType,
    resourceKey?: string
  ): Observable<Array<ReferenceDataModelBase> | ReferenceDataModelBase | ReferenceDataTyre> {
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

    return result ? of(result) : throwError(() => new Error('Reference data with specified resource key not found (404)'));
  }

  private getMockReferenceData(type: ReferenceDataResourceType): ReferenceDataModelBase[] | Error {
    switch (type) {
      case ReferenceDataResourceType.BodyMake:
        return mockBodyMakes;
      case ReferenceDataResourceType.BodyModel:
        return mockBodyModels;
      case ReferenceDataResourceType.Brake:
        return mockBrakes;
      case ReferenceDataResourceType.CountryOfRegistration:
        return mockCountriesOfRegistration;
      case ReferenceDataResourceType.PsvMake:
        return mockPsvMakes;
      case ReferenceDataResourceType.ReasonsForAbandoningPsv:
        return mockReasonsForAbandoningPsv;
      case ReferenceDataResourceType.ReasonsForAbandoningHgv:
        return mockReasonsForAbandoningHgv;
      case ReferenceDataResourceType.ReasonsForAbandoningTrl:
        return mockReasonsForAbandoningTrl;
      case ReferenceDataResourceType.SpecialistReasonsForAbandoning:
        return mockSpecialistSpecialistReasonsForAbandoning;
      case ReferenceDataResourceType.TIRReasonsForAbandoning:
        return mockTIRReasonsForAbandoning;
      case ReferenceDataResourceType.Tyres:
        return mockTyres;
      case ReferenceDataResourceType.User:
        return mockUsers;
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

  getReferenceDataOptions(resourceType: ReferenceDataResourceType): Observable<MultiOptions> {
    return this.mapReferenceDataOptions(this.getAll$(resourceType));
  }

  private mapReferenceDataOptions(referenceData: Observable<ReferenceDataModelBase[]>): Observable<MultiOptions> {
    return referenceData.pipe(map(options => options.map(option => ({ value: option.resourceKey, label: option.description }))));
  }

  getReasonsForAbandoning(vehicleType: VehicleTypes | undefined): Observable<MultiOptions> {
    if (!vehicleType) {
      return of([]);
    }
    return this.mapReferenceDataOptions(this.store.pipe(select(selectReasonsForAbandoning(vehicleType))));
  }
}
