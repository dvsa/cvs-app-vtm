import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import {
  catchError, map, of, switchMap,
} from 'rxjs';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from '../actions/tech-record-search.actions';

@Injectable()
export class TechSearchResultsEffects {
  fetchSearchResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchSearchResult),
      switchMap(({ searchBy, term }) =>
        this.techRecordHttpService.search$(searchBy ?? SEARCH_TYPES.ALL, term).pipe(
          map((results) => fetchSearchResultSuccess({ payload: results })),
          catchError((e) =>
            of(fetchSearchResultFailed({ error: this.getTechRecordErrorMessage(e, 'getTechnicalRecords', searchBy), anchorLink: 'search-term' }))),
        )),
    ));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTechRecordErrorMessage(error: any, type: string, search?: string): string {
    if (typeof error !== 'object') {
      return error;
    } if (error.status === 404) {
      return this.apiErrors[`${type}_404`];
    }
    const messageFromSearchType = search === SEARCH_TYPES.ALL ? 'the current search criteria' : search;
    return `${this.apiErrors[`${type}_400`]} ${messageFromSearchType ?? JSON.stringify(error.error)}`;

  }

  private apiErrors: Record<string, string> = {
    getTechnicalRecords_400: 'There was a problem getting the Tech Record by',
    getTechnicalRecords_404: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
  };

  constructor(private actions$: Actions, private techRecordHttpService: TechnicalRecordHttpService) {}
}
