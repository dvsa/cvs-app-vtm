import { Injectable } from '@angular/core';
import { ReferenceDataModelBase } from '@models/reference-data.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/.';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fetchReferenceData, fetchReferenceDataByKey, fetchReferenceDataByKeyFailed, fetchReferenceDataByKeySuccess, fetchReferenceDataFailed, fetchReferenceDataSuccess } from '../actions/reference-data.actions';

@Injectable()
export class ReferenceDataEffects {
  fetchReferenceDataByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceData),
      mergeMap(({ resourceType }) =>
        this.referenceDataService.fetchReferenceData(resourceType).pipe(
          map((data) => fetchReferenceDataSuccess({ resourceType, payload: data as Array<ReferenceDataModelBase> })),
          catchError((e) => of(fetchReferenceDataFailed({ error: e.message })))
        )
      )
    )
  );

  fetchReferenceDataByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceDataByKey),
      mergeMap(({ resourceType, resourceKey }) =>
        this.referenceDataService.fetchReferenceData(resourceType, resourceKey).pipe(
          map((data) => fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: data as ReferenceDataModelBase })),
          catchError((e) => of(fetchReferenceDataByKeyFailed({ error: e.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private referenceDataService: ReferenceDataService, private store: Store<State>) {}
}
