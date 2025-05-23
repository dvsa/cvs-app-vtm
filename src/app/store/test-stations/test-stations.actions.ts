import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TestStation } from '@models/test-stations/test-station.model';
import { createAction, props } from '@ngrx/store';

export const fetchTestStations = createAction(getTitle(true));
export const fetchTestStationsSuccess = createAction(getTitle(true, 'Success'), props<{ payload: TestStation[] }>());
export const fetchTestStationsFailed = createAction(getTitle(true, 'Failed'), props<GlobalError>());
export const fetchTestStationsComplete = createAction(getTitle(true, 'Complete'));

export const fetchTestStation = createAction(getTitle(), props<{ id: string }>());
export const fetchTestStationSuccess = createAction(
	getTitle(false, 'Success'),
	props<{ id: string; payload: TestStation }>()
);
export const fetchTestStationFailed = createAction(getTitle(false, 'Failed'), props<GlobalError>());

function getTitle(isPlural = false, suffix = ''): string {
	const plural = isPlural ? 's' : ' by ID';
	suffix = suffix ? ` ${suffix}` : suffix;
	return `[API/test-stations] Fetch Test Station${plural}${suffix}`;
}
