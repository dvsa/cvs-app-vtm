import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { createAction, props } from '@ngrx/store';

export const fetchSearchResult = createAction(getTitle(), props<{ searchBy?: SEARCH_TYPES; term: string }>());
export const fetchSearchResultSuccess = createAction(
	getTitle('Success'),
	props<{ payload: TechRecordSearchSchema[] }>()
);
export const fetchSearchResultFailed = createAction(getTitle('Failed'), props<GlobalError>());

function getTitle(suffix = ''): string {
	suffix = suffix ? ` ${suffix}` : suffix;
	return `[API/tech-records search] Search Results ${suffix}`;
}
