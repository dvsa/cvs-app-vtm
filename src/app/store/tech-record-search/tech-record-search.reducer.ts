import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from './tech-record-search.actions';

interface Extras {
	error: string;
	loading: boolean;
	hasSearched: boolean;
	includeArchived?: boolean;
}

export interface SearchResultState extends EntityState<TechRecordSearchSchema>, Extras {}

export const STORE_FEATURE_SEARCH_TECH_RESULTS_KEY = 'techSearchResults';

export const techSearchResultFeatureState = createFeatureSelector<SearchResultState>(
	STORE_FEATURE_SEARCH_TECH_RESULTS_KEY
);

export const techSearchResultAdapter: EntityAdapter<TechRecordSearchSchema> =
	createEntityAdapter<TechRecordSearchSchema>({
		selectId: (result) => `${result.systemNumber}#${result.createdTimestamp}`,
	});

export const initialTechSearchResultState: EntityState<TechRecordSearchSchema> & Extras =
	techSearchResultAdapter.getInitialState({ loading: false, hasSearched: false, error: '' });

export const techSearchResultReducer = createReducer(
	initialTechSearchResultState,
	on(fetchSearchResult, (state, { includeArchived }) => ({
		...state,
		includeArchived,
		loading: true,
		hasSearched: false,
		error: '',
	})),
	on(fetchSearchResultSuccess, (state, action) => ({
		...techSearchResultAdapter.setAll(action.payload, state),
		loading: false,
		hasSearched: true,
		error: '',
	})),
	on(fetchSearchResultFailed, (state, action) => ({
		...techSearchResultAdapter.setAll([], state),
		loading: false,
		error: action.error,
	}))
);
