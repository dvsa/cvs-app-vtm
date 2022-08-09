import { Defect } from "@models/defect";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchDefect, fetchDefectFailed, fetchDefects, fetchDefectsFailed, fetchDefectsSuccess, fetchDefectSuccess } from "../actions/defects.actions";

export interface DefectsState extends EntityState<Defect> {
  loading: boolean;
  error: string;
}

export const STORE_FEATURE_DEFECTS_KEY = 'Defects';

export const defectsFeatureState = createFeatureSelector<DefectsState>(STORE_FEATURE_DEFECTS_KEY);

export const defectsAdapter: EntityAdapter<Defect> = createEntityAdapter<Defect>({ selectId: defect => defect.deficiencyId! });

export const initialDefectsState  = defectsAdapter.getInitialState({ loading: false, error: '' });

export const defectsReducer = createReducer(
  initialDefectsState,

  on(fetchDefects, state => ({ ...state, loading: true })),
  on(fetchDefectsSuccess, (state, action) => ({ ...defectsAdapter.setAll(action.payload, state), loading: false })),
  on(fetchDefectsFailed, state => ({ ...defectsAdapter.setAll([], state), loading: false })),

  on(fetchDefect, state => ({ ...state, loading: true })),
  on(fetchDefectSuccess, (state, action) => ({ ...defectsAdapter.upsertOne(action.payload, state), loading: false })),
  on(fetchDefectFailed, state => ({ ...defectsAdapter.setAll([], state), loading: false })),
);
