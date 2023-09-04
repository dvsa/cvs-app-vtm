import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from '../actions/tech-record-search.actions';

export interface SearchResultState extends EntityState<TechRecordSearchSchema> {
  loading: boolean;
  error: string;
}

export const STORE_FEATURE_SEARCH_TECH_RESULTS_KEY = 'techSearchResults';

export const techSearchResultFeatureState = createFeatureSelector<SearchResultState>(STORE_FEATURE_SEARCH_TECH_RESULTS_KEY);

export const techSearchResultAdapter: EntityAdapter<TechRecordSearchSchema> = createEntityAdapter<TechRecordSearchSchema>({
  selectId: result => `${result.systemNumber}#${result.createdTimestamp}`
});

export const initialTechSearchResultState = techSearchResultAdapter.getInitialState({ loading: false, error: '' });

export const techSearchResultReducer = createReducer(
  initialTechSearchResultState,
  on(fetchSearchResult, state => ({ ...state, loading: true })),
  on(fetchSearchResultSuccess, (state, action) => ({ ...techSearchResultAdapter.setAll(action.payload, state), loading: false })),
  on(fetchSearchResultFailed, (state, action) => ({
    ...techSearchResultAdapter.setAll([], state),
    loading: false,
    error: action.error
  }))
);
