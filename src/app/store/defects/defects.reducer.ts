import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
	fetchDefect,
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsComplete,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from './defects.actions';

interface Extras {
	error: string;
	loading: boolean;
}

export interface DefectsState extends EntityState<DefectCategoryReferenceDataSchema>, Extras {}

export const STORE_FEATURE_DEFECTS_KEY = 'Defects';

export const defectsFeatureState = createFeatureSelector<DefectsState>(STORE_FEATURE_DEFECTS_KEY);

export const defectsAdapter: EntityAdapter<DefectCategoryReferenceDataSchema> =
	createEntityAdapter<DefectCategoryReferenceDataSchema>({
		selectId: (defect) => `${defect.imNumber}: ${defect.imDescription}`,
	});

export const initialDefectsState: EntityState<DefectCategoryReferenceDataSchema> & Extras =
	defectsAdapter.getInitialState({
		loading: false,
		error: '',
	});

export const defectsReducer = createReducer(
	initialDefectsState,

	on(fetchDefects, (state) => ({ ...state, loading: true })),
	on(fetchDefectsSuccess, (state, action) => ({ ...defectsAdapter.setAll(action.payload, state), loading: false })),
	on(fetchDefectsFailed, (state) => ({ ...defectsAdapter.setAll([], state), loading: false })),

	on(fetchDefect, (state) => ({ ...state, loading: true })),
	on(fetchDefectSuccess, (state, action) => ({ ...defectsAdapter.upsertOne(action.payload, state), loading: false })),
	on(fetchDefectFailed, (state) => ({ ...defectsAdapter.setAll([], state), loading: false })),
	on(fetchDefectsComplete, (state) => ({ ...state, loading: false }))
);
