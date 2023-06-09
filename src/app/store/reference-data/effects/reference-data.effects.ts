import { Injectable } from '@angular/core';
import { ReferenceDataApiResponse, ReferenceDataApiResponseWithPagination } from '@api/reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { testResultInEdit } from '@store/test-records';
import { catchError, map, mergeMap, of, switchMap, take, withLatestFrom } from 'rxjs';
import {
  amendReferenceDataItem,
  amendReferenceDataItemFailure,
  createReferenceDataItem,
  createReferenceDataItemFailure,
  fetchReasonsForAbandoning,
  fetchReferenceData,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeyFailed,
  fetchReferenceDataByKeySearch,
  fetchReferenceDataByKeySearchFailed,
  fetchReferenceDataByKeySearchSuccess,
  fetchReferenceDataByKeySuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataSuccess,
  fetchTyreReferenceDataByKeySearch,
  fetchTyreReferenceDataByKeySearchFailed,
  fetchTyreReferenceDataByKeySearchSuccess
} from '../actions/reference-data.actions';
import { handleNotFound, sortReferenceData } from './operators';

@Injectable()
export class ReferenceDataEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private referenceDataService: ReferenceDataService,
    private store: Store<State>
  ) {}

  fetchReferenceDataByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceData),
      mergeMap(({ resourceType, paginationToken }) =>
        this.referenceDataService.fetchReferenceData(resourceType, paginationToken).pipe(
          handleNotFound(resourceType),
          sortReferenceData(resourceType),
          switchMap(data => {
            if (isPaginated(data)) {
              return of(
                fetchReferenceDataSuccess({ resourceType, payload: data.data as ReferenceDataModelBase[], paginated: true }),
                fetchReferenceData({ resourceType, paginationToken: data.paginationToken })
              );
            }
            return of(fetchReferenceDataSuccess({ resourceType, payload: data.data as ReferenceDataModelBase[], paginated: false }));
          }),
          catchError(e => of(fetchReferenceDataFailed({ error: e.message, resourceType })))
        )
      )
    )
  );

  fetchReferenceDataByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceDataByKey),
      mergeMap(({ resourceType, resourceKey }) =>
        this.referenceDataService.fetchReferenceDataByKey(resourceType, resourceKey).pipe(
          handleNotFound(resourceType, resourceKey),
          map(data => fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: data as ReferenceDataModelBase })),
          catchError(e => of(fetchReferenceDataByKeyFailed({ error: e.message, resourceType })))
        )
      )
    )
  );

  fetchReferenceDataByKeySearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceDataByKeySearch),
      mergeMap(({ resourceType, resourceKey }) =>
        this.referenceDataService.fetchReferenceDataByKeySearch(resourceType, resourceKey).pipe(
          map(data => fetchReferenceDataByKeySearchSuccess({ resourceType, resourceKey, payload: data.data as ReferenceDataModelBase[] })),
          catchError(e => of(fetchReferenceDataByKeySearchFailed({ error: e.message, resourceType })))
        )
      )
    )
  );

  fetchTyreReferenceDataByKeySearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTyreReferenceDataByKeySearch),
      mergeMap(({ searchFilter, searchTerm }) =>
        this.referenceDataService.fetchTyreReferenceDataByKeySearch(searchFilter, searchTerm).pipe(
          map(data =>
            fetchTyreReferenceDataByKeySearchSuccess({
              resourceType: ReferenceDataResourceType.Tyres,
              payload: data.data as ReferenceDataModelBase[]
            })
          ),
          catchError(e => of(fetchTyreReferenceDataByKeySearchFailed({ error: e.message, resourceType: ReferenceDataResourceType.Tyres })))
        )
      )
    )
  );

  fetchReasonsForAbandoning = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReasonsForAbandoning),
      mergeMap(() => this.store.pipe(select(testResultInEdit), take(1))),
      map(testResult => {
        switch (testResult?.vehicleType) {
          case VehicleTypes.PSV:
            return fetchReferenceData({ resourceType: ReferenceDataResourceType.ReasonsForAbandoningPsv });
          case VehicleTypes.HGV:
            return fetchReferenceData({ resourceType: ReferenceDataResourceType.ReasonsForAbandoningHgv });
          case VehicleTypes.TRL:
            return fetchReferenceData({ resourceType: ReferenceDataResourceType.ReasonsForAbandoningTrl });
          default:
            throw new Error('Unexpected vehicle type');
        }
      })
    )
  );

  createReferenceDataItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReferenceDataItem),
      withLatestFrom(this.userService.id$, this.userService.name$),
      switchMap(([{ resourceType, resourceKey, payload }, createdId, createdName]) => {
        payload = { ...payload, createdId, createdName, createdAt: new Date().toISOString() };
        return this.referenceDataService.createReferenceDataItem(resourceType, resourceKey, payload).pipe(
          map((result: ReferenceDataModelBase) => fetchReferenceData({ resourceType })),
          catchError(error => of(createReferenceDataItemFailure({ error: error })))
        );
      })
    )
  );

  // The amend effect will work when the referenceData.service.ts is amended on line 395 from <EmptyObject> to <any>

  // amendReferenceDataItem$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(amendReferenceDataItem),
  //     withLatestFrom(this.userService.id$, this.userService.name$),
  //     switchMap(([{ resourceType, resourceKey, payload }, createdId, createdName]) => {
  //       payload = { ...payload, createdId, createdName, createdAt: new Date().toISOString() };
  //       return this.referenceDataService.amendReferenceDataItem(resourceType, resourceKey, payload).pipe(
  //         map((result: ReferenceDataModelBase) => fetchReferenceData({ resourceType })),
  //         catchError(error => of(amendReferenceDataItemFailure({ error: error })))
  //       );
  //     })
  //   )
  // );
}

function isPaginated(referenceDataApiResponse: ReferenceDataApiResponse): referenceDataApiResponse is ReferenceDataApiResponseWithPagination {
  return referenceDataApiResponse.hasOwnProperty('paginationToken');
}
