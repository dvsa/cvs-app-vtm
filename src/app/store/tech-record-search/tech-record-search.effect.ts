import { Injectable, inject } from '@angular/core';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpService } from '@services/http/http.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from './tech-record-search.actions';

@Injectable()
export class TechSearchResultsEffects {
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);

	fetchSearchResults$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchSearchResult),
			switchMap(({ searchBy, term }) =>
				this.httpService.searchTechRecords(searchBy ?? SEARCH_TYPES.ALL, term).pipe(
					map((results) => fetchSearchResultSuccess({ payload: results })),
					catchError((e) =>
						of(
							fetchSearchResultFailed({
								error: this.getTechRecordErrorMessage(e, 'getTechnicalRecords', searchBy),
								anchorLink: 'search-term',
							})
						)
					)
				)
			)
		)
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getTechRecordErrorMessage(error: any, type: string, search?: string): string {
		if (typeof error !== 'object') {
			return error;
		}
		if (error.status === 404) {
			return this.apiErrors[`${type}_404`];
		}
		const messageFromSearchType = search === SEARCH_TYPES.ALL ? 'the current search criteria' : search;
		return `${this.apiErrors[`${type}_400`]} ${messageFromSearchType ?? JSON.stringify(error.error)}`;
	}

	private apiErrors: Record<string, string> = {
		getTechnicalRecords_400: 'There was a problem getting the Tech Record by',
		getTechnicalRecords_404:
			'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
	};
}
