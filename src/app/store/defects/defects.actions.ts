import { GlobalError } from '@core/components/global-error/global-error.interface';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { createAction, props } from '@ngrx/store';

export const fetchDefects = createAction(getTitle(true));
export const fetchDefectsSuccess = createAction(
	getTitle(true, 'Success'),
	props<{ payload: DefectCategoryReferenceDataSchema[] }>()
);
export const fetchDefectsFailed = createAction(getTitle(true, 'Failed'), props<GlobalError>());
export const fetchDefectsComplete = createAction(getTitle(true, 'Complete'));

export const fetchDefect = createAction(getTitle(), props<{ id: number }>());
export const fetchDefectSuccess = createAction(
	getTitle(false, 'Success'),
	props<{ id: number; payload: DefectCategoryReferenceDataSchema }>()
);
export const fetchDefectFailed = createAction(getTitle(false, 'Failed'), props<GlobalError>());

function getTitle(isPlural = false, suffix = ''): string {
	const plural = isPlural ? 's' : ' by ID';
	suffix = suffix ? ` ${suffix}` : suffix;
	return `[API/defects] Fetch Defect${plural}${suffix}`;
}
