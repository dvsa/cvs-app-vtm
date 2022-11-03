import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_PATH, Configuration, ReferenceDataApiService } from '@api/reference-data';
import { MultiOptions } from '@forms/models/options.model';
import { mockBodyMakes } from '@mocks/reference-data/mock-body-makes';
import { mockBodyModels } from '@mocks/reference-data/mock-body-models';
import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { mockTyres } from '@mocks/reference-data/mock-tyres';
import { mockReasonsForAbandoningHgv } from '@mocks/reference-data/mock-hgv-reasons-for-abandoning.reference-data';
import { mockReasonsForAbandoningPsv } from '@mocks/reference-data/mock-psv-reasons-for-abandoning.reference-data';
import { mockSpecialistSpecialistReasonsForAbandoning } from '@mocks/reference-data/mock-specialist-reasons-for-abandoning.reference-data';
import { mockTIRReasonsForAbandoning } from '@mocks/reference-data/mock-TIR-reasons-for-abandoning.reference-data';
import { mockReasonsForAbandoningTrl } from '@mocks/reference-data/mock-trl-reasons-for-abandoning.reference-data';
import { mockUsers } from '@mocks/reference-data/mock-user.reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
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
export class ReferenceDataService extends ReferenceDataApiService {
  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
    private store: Store<ReferenceDataState>
  ) {
    super(httpClient, basePath, configuration);
  }

  fetchReferenceData(
    resourceType: ReferenceDataResourceType,
    resourceKey?: string
  ): Observable<Array<ReferenceDataModelBase> | ReferenceDataModelBase> {
    if (!resourceType) {
      return throwError(() => new Error('Reference data resourceType is required'));
    }

    return resourceKey ? this.getOneFromResource(resourceType, resourceKey) : this.getAllFromResource(resourceType);
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
