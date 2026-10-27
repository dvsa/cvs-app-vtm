import { StatusCodes } from '@/src/app/models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { techSearchResultAdapter, techSearchResultFeatureState } from './tech-record-search.reducer';

const { selectAll } = techSearchResultAdapter.getSelectors();

export const selectTechRecordSearchLoadingState = createSelector(
	techSearchResultFeatureState,
	(state) => state.loading
);
export const selectTechRecordSearchResults = createSelector(techSearchResultFeatureState, (state) => selectAll(state));

export const selectTechRecordSearchResultsForDisplay = createSelector(
	techSearchResultFeatureState,
	selectTechRecordSearchResults,
	(state, searchResults) =>
		searchResults
			.filter(
				(record) =>
					record.techRecord_statusCode === StatusCodes.CURRENT ||
					record.techRecord_statusCode === StatusCodes.PROVISIONAL ||
					(state.includeArchived && record.techRecord_statusCode === StatusCodes.ARCHIVED)
			)
			.sort(
				(a, b) =>
					Number(a.techRecord_statusCode === StatusCodes.ARCHIVED) -
					Number(b.techRecord_statusCode === StatusCodes.ARCHIVED)
			)
);

export const selectTechRecordSearchView = createSelector(
	techSearchResultFeatureState,
	selectTechRecordSearchResults,
	selectTechRecordSearchResultsForDisplay,
	(state, allResults, results) => ({
		results,
		showNoRecords: state.hasSearched && !state.loading && !state.error && results.length === 0,
		hasArchivedRecords:
			!state.includeArchived && allResults.some((record) => record.techRecord_statusCode === StatusCodes.ARCHIVED),
	})
);
