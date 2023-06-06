import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from '../actions/tech-record-search.actions';
import { GlobalError } from '@core/components/global-error/global-error.interface';

export interface SearchResult {
  systemNumber: string;
  createdTimestamp: string;
  vin: string;
  primaryVrm?: string;
  trailerId?: string;
  techRecord_vehicleType: string;
  techRecord_manufactureYear?: number | null;
  techRecord_chassisMake?: string;
  techRecord_chassisModel?: string;
  techRecord_make?: string;
  techRecord_model?: string;
  techRecord_statusCode?: string;
}

export interface SearchResultState extends EntityState<SearchResult> {
  loading: boolean;
  error: string;
}

export const STORE_FEATURE_SEARCH_TECH_RESULTS_KEY = 'techSearchResults';

export const techSearchResultFeatureState = createFeatureSelector<SearchResultState>(STORE_FEATURE_SEARCH_TECH_RESULTS_KEY);

export const techSearchResultAdapter: EntityAdapter<SearchResult> = createEntityAdapter<SearchResult>({
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
