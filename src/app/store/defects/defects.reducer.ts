import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchDefectFailed, fetchDefectSuccess, fetchDefectsFailed, fetchDefectsSuccess } from './defects.actions';

interface Extras {
	error: string;
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
		error: '',
	});

export const defectsReducer = createReducer(
	initialDefectsState,
	on(fetchDefectsSuccess, (state, action) => ({ ...defectsAdapter.setAll(action.payload, state) })),
	on(fetchDefectsFailed, (state) => ({ ...defectsAdapter.setAll([], state) })),
	on(fetchDefectSuccess, (state, action) => ({ ...defectsAdapter.upsertOne(action.payload, state) })),
	on(fetchDefectFailed, (state) => ({ ...defectsAdapter.setAll([], state) }))
);
