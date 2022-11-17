import { Injectable } from '@angular/core';
import { ReferenceDataApiResponse, ReferenceDataApiResponseWithPagination, ReferenceDataItemApiResponse } from '@api/reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/.';
import { testResultInEdit } from '@store/test-records';
import { catchError, map, mergeMap, Observable, of, switchMap, take, throwError } from 'rxjs';
import {
  fetchReasonsForAbandoning,
  fetchReferenceData,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeyFailed,
  fetchReferenceDataByKeySuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataSuccess
} from '../actions/reference-data.actions';

@Injectable()
export class ReferenceDataEffects {
  fetchReferenceDataByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceData),
      mergeMap(({ resourceType, paginationToken }) =>
        this.referenceDataService.fetchReferenceData(resourceType, paginationToken).pipe(
          handleNotFound(resourceType),
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

  constructor(private actions$: Actions, private referenceDataService: ReferenceDataService, private store: Store<State>) {}
}

function isPaginated(referenceDataApiResponse: ReferenceDataApiResponse): referenceDataApiResponse is ReferenceDataApiResponseWithPagination {
  return referenceDataApiResponse.hasOwnProperty('paginationToken');
}

/**
 * handles response from reference data API to throw an error if not found i.e. response is a success with empty objects or no data.
 * @param args - lookup properties used by the API. will be used to construct error message when not found.
 * @returns emitted source value or error if response is equivalent to not found.
 */
function handleNotFound(...args: any[]) {
  return function <T>(source: Observable<T>): Observable<T> {
    const isEmpty = (val: any) => !Object.keys(val).length || (val.hasOwnProperty('data') && !val.data.length);
    return new Observable(subscriber => {
      source.subscribe({
        next: val => {
          if (val && isEmpty(val)) {
            subscriber.error(new Error(`Reference data not found for resource type ${args}`));
          }

          subscriber.next(val);
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete()
      });
    });
  };
}
