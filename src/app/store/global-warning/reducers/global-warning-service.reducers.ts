import { routerNavigatedAction } from '@ngrx/router-store';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as GlobalWarningActions from '../actions/global-warning.actions';
import { GlobalWarning } from '@core/components/global-warning/global-warning.interface';
import { fetchSearchResult } from '@store/tech-record-search/actions/tech-record-search.actions';
import * as TechnicalRecordServiceActions from '../../technical-records/actions/technical-record-service.actions';


export const STORE_FEATURE_GLOBAL_WARNING_KEY = 'globalWarning';

export interface GlobalWarningState {
  warnings: Array<GlobalWarning>;
}

export const initialGlobalWarningState: GlobalWarningState = {
  warnings: []
};

export const getGlobalWarningState = createFeatureSelector<GlobalWarningState>(STORE_FEATURE_GLOBAL_WARNING_KEY);

export const globalWarningState = createSelector(getGlobalWarningState, state => state.warnings);

export const globalWarningReducer = createReducer(
  initialGlobalWarningState,
  on(
    GlobalWarningActions.clearWarning,
    TechnicalRecordServiceActions.updateTechRecord,
    fetchSearchResult,
    routerNavigatedAction, successMethod
  ),

  on(GlobalWarningActions.setWarnings, (state, { warnings }) => ({
    ...state,
    warnings: [...warnings]
  }))
);

function successMethod(state: GlobalWarningState) {
  return { ...state, errors: [] };
}

// function failureMethod(state: GlobalWarningState, warningMessage: { warning: any; anchorLink?: any }) {
//   return { ...state, warnings: [...state.warnings, { error: warningMessage.warning, anchorLink: warningMessage.anchorLink }] };
// }
