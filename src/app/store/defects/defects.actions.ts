import { GlobalError } from '@core/components/global-error/global-error.interface';
import { Defect } from '@models/defects/defect.model';
import { createAction, props } from '@ngrx/store';

export const fetchDefects = createAction(getTitle(true));
export const fetchDefectsSuccess = createAction(getTitle(true, 'Success'), props<{ payload: Defect[] }>());
export const fetchDefectsFailed = createAction(getTitle(true, 'Failed'), props<GlobalError>());

export const fetchDefect = createAction(getTitle(), props<{ id: number }>());
export const fetchDefectSuccess = createAction(getTitle(false, 'Success'), props<{ id: number; payload: Defect }>());
export const fetchDefectFailed = createAction(getTitle(false, 'Failed'), props<GlobalError>());

function getTitle(isPlural = false, suffix = ''): string {
	const plural = isPlural ? 's' : ' by ID';
	suffix = suffix ? ` ${suffix}` : suffix;
	return `[API/defects] Fetch Defect${plural}${suffix}`;
}
