import { DefectGETIVA } from '@dvsa/cvs-type-definitions/types/iva/defects/get';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { getRequiredStandards, getRequiredStandardsFailure, getRequiredStandardsSuccess } from '../actions/required-standards.actions';

export interface RequiredStandardState {
  loading: boolean;
  error: string;
  requiredStandards: DefectGETIVA
}

export const STORE_FEATURE_REQUIRED_STANDARDS_KEY = 'RequiredStandards';

export const requiredStandardsFeatureState = createFeatureSelector<RequiredStandardState>(STORE_FEATURE_REQUIRED_STANDARDS_KEY);

export const initialRequiredStandardsState: RequiredStandardState = {
  loading: false,
  error: '',
  requiredStandards: {
    basic: [],
    normal: [],
    euVehicleCategories: [],
  },

};

export const requiredStandardsReducer = createReducer(
  initialRequiredStandardsState,

  on(getRequiredStandards, (state) => ({ ...state, loading: true })),
  on(getRequiredStandardsSuccess, (state, action) => ({ ...state, requiredStandards: action.requiredStandards, loading: false })),
  on(getRequiredStandardsFailure, (state) => ({ ...state, loading: false })),

);
