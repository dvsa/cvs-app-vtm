import { Injectable } from '@angular/core';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/.';
import { testResultInEdit } from '@store/test-records';
import { catchError, map, mergeMap, of, switchMap, take } from 'rxjs';
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
      mergeMap(({ resourceType }) =>
        this.referenceDataService.fetchReferenceData(resourceType).pipe(
          map(data => fetchReferenceDataSuccess({ resourceType, payload: data as Array<ReferenceDataModelBase> })),
          catchError(e => of(fetchReferenceDataFailed({ error: e.message })))
        )
      )
    )
  );

  fetchReferenceDataByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceDataByKey),
      mergeMap(({ resourceType, resourceKey }) =>
        this.referenceDataService.fetchReferenceData(resourceType, resourceKey).pipe(
          map(data => fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: data as ReferenceDataModelBase })),
          catchError(e => of(fetchReferenceDataByKeyFailed({ error: e.message })))
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
