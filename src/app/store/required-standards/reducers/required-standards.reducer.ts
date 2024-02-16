import { DefectGETIVA } from '@dvsa/cvs-type-definitions/types/iva/defects/get';
import { EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { getRequiredStandards, getRequiredStandardsFailure, getRequiredStandardsSuccess } from '../actions/required-standards.actions';

export interface RequiredStandardState extends EntityState<DefectGETIVA> {
  loading: boolean;
  error: string;
}

export const STORE_FEATURE_REQUIRED_STANDARDS_KEY = 'RequiredStandards';

export const requiredStandardsFeatureState = createFeatureSelector<RequiredStandardState>(STORE_FEATURE_REQUIRED_STANDARDS_KEY);

export const initialRequiredStandardsState = {
  loading: false,
  error: null,
  requiredStandards: {},
};

export const requiredStandardsReducer = createReducer(
  initialRequiredStandardsState,

  on(getRequiredStandards, (state) => ({ ...state, loading: true })),
  on(getRequiredStandardsSuccess, (state, action) => ({ ...state, requiredStandards: action.requiredStandards, loading: false })),
  on(getRequiredStandardsFailure, (state) => ({ ...state, loading: false })),

);
