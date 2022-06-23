import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/.';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fetchReferenceData, fetchReferenceDataFailed, fetchReferenceDataSuccess } from '../actions/reference-data.actions';

@Injectable()
export class ReferenceDataEffects {
  fetchCountryOfRegistrations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReferenceData),
      mergeMap(({ resourceType }) =>
        this.referenceDataService.fetchReferenceDataByType(resourceType).pipe(
          map((data) => fetchReferenceDataSuccess({ resourceType, payload: data })),
          catchError((e) => of(fetchReferenceDataFailed({ error: e.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private referenceDataService: ReferenceDataService, private store: Store<State>) {}
}
