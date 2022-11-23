import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  BASE_PATH,
  Configuration,
  ReferenceDataApiResponse,
  ReferenceDataItemApiResponse,
  ReferenceDataService as ReferenceDataApiService
} from '@api/reference-data';
import { MultiOptions } from '@forms/models/options.model';
import { ReferenceDataModelBase, ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import {
  addSearchInformation,
  fetchReferenceData,
  fetchReferenceDataByKeySearch,
  fetchTyreReferenceDataByKeySearch,
  ReferenceDataState,
  removeTyreSearch,
  selectAllReferenceDataByResourceType,
  selectReasonsForAbandoning,
  selectReferenceDataByResourceKey,
  selectTyreSearchFilter,
  selectTyreSearchReturn,
  selectTyreSearchTerm
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

  fetchReferenceData(resourceType: ReferenceDataResourceType, paginationToken?: string): Observable<ReferenceDataApiResponse> {
    if (!resourceType) {
      return throwError(() => new Error('Reference data resourceType is required'));
    }

    return this.referenceResourceTypeGet(resourceType, paginationToken, 'body');
  }

  fetchReferenceDataByKey(resourceType: ReferenceDataResourceType, resourceKey: string | number): Observable<ReferenceDataItemApiResponse> {
    return this.referenceResourceTypeResourceKeyGet(resourceType, resourceKey, 'body');
  }

  fetchReferenceDataByKeySearch(resourceType: ReferenceDataResourceType, resourceKey: string | number): Observable<ReferenceDataApiResponse> {
    return this.referenceLookupResourceTypeResourceKeyGet(resourceType, resourceKey, 'body');
  }

  fetchTyreReferenceDataByKeySearch(searchFilter: string, searchTerm: string): Observable<ReferenceDataApiResponse> {
    return this.referenceLookupTyresSearchKeyParamGet(searchFilter, searchTerm, 'body');
  }

  loadReferenceDataByKeySearch(resourceType: ReferenceDataResourceType, resourceKey: string | number): void {
    this.store.dispatch(fetchReferenceDataByKeySearch({ resourceType, resourceKey }));
  }
  loadTyreReferenceDataByKeySearch(searchFilter: string, searchTerm: string): void {
    this.store.dispatch(fetchTyreReferenceDataByKeySearch({ searchFilter, searchTerm }));
  }

  loadReferenceData(resourceType: ReferenceDataResourceType): void {
    this.store.dispatch(fetchReferenceData({ resourceType }));
  }

  addSearchInformation(term: string, filter: string): void {
    this.store.dispatch(addSearchInformation({ filter, term }));
  }

  removeTyreSearch() {
    return this.store.dispatch(removeTyreSearch());
  }

  getTyreSearchReturn$ = () => {
    return this.store.pipe(select(selectTyreSearchReturn()));
  };

  getTyreSearchFilter$ = () => {
    return this.store.pipe(select(selectTyreSearchFilter()));
  };
  getTyreSearchTerm$ = () => {
    return this.store.pipe(select(selectTyreSearchTerm()));
  };

  getAll$ = (resourceType: ReferenceDataResourceType): Observable<ReferenceDataModelBase[] | undefined> => {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(resourceType)));
  };

  getByKey$ = (resourceType: ReferenceDataResourceType, resourceKey: string | number) => {
    return this.store.pipe(select(selectReferenceDataByResourceKey(resourceType, resourceKey)));
  };

  getReferenceDataOptions(resourceType: ReferenceDataResourceType): Observable<MultiOptions | undefined> {
    return this.mapReferenceDataOptions(this.getAll$(resourceType));
  }

  private mapReferenceDataOptions(referenceData: Observable<ReferenceDataModelBase[] | undefined>): Observable<MultiOptions | undefined> {
    return referenceData.pipe(map(options => options?.map(option => ({ value: option.resourceKey, label: option.description ?? '' }))));
  }

  getReasonsForAbandoning(vehicleType: VehicleTypes | undefined): Observable<MultiOptions | undefined> {
    if (!vehicleType) {
      return of([]);
    }
    return this.mapReferenceDataOptions(this.store.pipe(select(selectReasonsForAbandoning(vehicleType))));
  }
}
