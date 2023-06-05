import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createAction, props } from '@ngrx/store';
import { SearchResult } from '../reducer/tech-record-search.reducer';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';

export const fetchSearchResult = createAction(getTitle(), props<{ searchBy?: SEARCH_TYPES; term: string }>());
export const fetchSearchResultSuccess = createAction(getTitle('Success'), props<{ payload: SearchResult[] }>());
export const fetchSearchResultFailed = createAction(getTitle('Failed'), props<GlobalError>());

function getTitle(suffix: string = ''): string {
  suffix = suffix ? ' ' + suffix : suffix;
  return '[API/tech-records search] Search Results ' + suffix;
}
