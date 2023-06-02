import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from '../actions/tech-record-search.actions';

@Injectable()
export class TechSearchResultsEffects {
  fetchSearchResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchSearchResult),
      switchMap(({ searchBy, term }) =>
        this.techRecordHttpService.search$(searchBy ?? SEARCH_TYPES.ALL, term).pipe(
          map(results => fetchSearchResultSuccess({ payload: results })),
          catchError(e => of(fetchSearchResultFailed({ error: e.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private techRecordHttpService: TechnicalRecordHttpService) {}
}
