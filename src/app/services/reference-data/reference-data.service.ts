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
import { ReferenceDataModelBase, ReferenceDataResourceType, ReferenceDataTyre, User } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { UserService } from '@services/user-service/user-service';
import {
  addSearchInformation,
  fetchReferenceData,
  fetchReferenceDataByKeySearch,
  fetchTyreReferenceDataByKeySearch,
  ReferenceDataEntityStateSearch,
  ReferenceDataState,
  referencePsvMakeLoadingState,
  removeTyreSearch,
  selectAllReferenceDataByResourceType,
  selectReasonsForAbandoning,
  selectReferenceDataByResourceKey,
  selectTyreSearchCriteria,
  selectSearchReturn
} from '@store/reference-data';
import { Observable, of, switchMap, throwError, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService extends ReferenceDataApiService {
  constructor(
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
    httpClient: HttpClient,
    private usersService: UserService,
    private store: Store<ReferenceDataState>
  ) {
    super(httpClient, basePath, configuration);
  }

  //  URL to POST new reference data items: /reference/{ type capitalized }/{ new key } POST

  createNewReferenceDataItem(type: ReferenceDataResourceType, key: string, data: any) {
    return this.usersService.id$.pipe(
      withLatestFrom(this.usersService.name$),
      switchMap(([createdId, createdName]) => {
        const referenceData = { ...data, createdId, createdName, createdAt: new Date() };

        return this.referenceResourceTypeResourceKeyPost(type, key, referenceData, 'body', false);
      })
    );
  }

  //  URL to PUT new reference data items: /reference/{ type capitalized }/{ new key } PUT

  amendReferenceDataItem(type: ReferenceDataResourceType, key: string, data: any) {
    return this.usersService.id$.pipe(
      withLatestFrom(this.usersService.name$),
      switchMap(([createdId, createdName]) => {
        const referenceData = { ...data, createdId, createdName, createdAt: new Date() };
        return this.referenceResourceTypeResourceKeyPut(type, key, referenceData, 'body', false);
      })
    );
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

  addSearchInformation(filter: string, term: string): void {
    this.store.dispatch(addSearchInformation({ filter, term }));
  }

  removeTyreSearch(): void {
    this.store.dispatch(removeTyreSearch());
  }

  getTyreSearchReturn$(): Observable<ReferenceDataTyre[] | null> {
    return this.store.pipe(select(selectSearchReturn(ReferenceDataResourceType.Tyres))) as Observable<ReferenceDataTyre[] | null>;
  }

  getTyreSearchCriteria$(): Observable<ReferenceDataEntityStateSearch> {
    return this.store.pipe(select(selectTyreSearchCriteria));
  }

  getAll$(resourceType: ReferenceDataResourceType): Observable<ReferenceDataModelBase[] | undefined> {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(resourceType)));
  }

  getByKey$(resourceType: ReferenceDataResourceType, resourceKey: string | number) {
    return this.store.pipe(select(selectReferenceDataByResourceKey(resourceType, resourceKey)));
  }

  getReferenceDataOptions(resourceType: ReferenceDataResourceType): Observable<MultiOptions | undefined> {
    return this.getAll$(resourceType).pipe(this.mapReferenceDataOptions);
  }

  private mapReferenceDataOptions = function (
    source: Observable<Array<ReferenceDataModelBase & Partial<User>> | undefined>
  ): Observable<MultiOptions | undefined> {
    return new Observable(subscriber => {
      source.subscribe({
        next: val => {
          subscriber.next(val?.map(option => ({ value: option.resourceKey, label: option.description ?? option.name ?? `${option.resourceKey}` })));
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete()
      });
    });
  };

  getReasonsForAbandoning(vehicleType: VehicleTypes | undefined): Observable<MultiOptions | undefined> {
    if (!vehicleType) {
      return of([]);
    }
    return this.store.pipe(select(selectReasonsForAbandoning(vehicleType)), this.mapReferenceDataOptions);
  }

  getReferencePsvMakeDataLoading$(): Observable<boolean> {
    return this.store.pipe(select(referencePsvMakeLoadingState));
  }

  camelCaseToTitleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
  }

  macroCasetoTitleCase(input: string | number | boolean): string {
    return input
      .toString()
      .split('_')
      .map(s => s.charAt(0) + s.slice(1).toLowerCase())
      .join(' ');
  }
}
