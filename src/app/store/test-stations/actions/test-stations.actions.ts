import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TestStation } from '@models/test-station.model';
import { createAction, props } from '@ngrx/store';

export const fetchTestStations = createAction('[API/test-stations] Fetch All Test Stations');
export const fetchTestStationsSuccess = createAction('[API/test-stations] Fetch All Test Stations Success', props<{ payload: TestStation[] }>());
export const fetchTestStationsFailed = createAction('[API/test-stations] Fetch All Test Stations Failed', props<GlobalError>());

export const fetchTestStation = createAction('[API/test-stations] Fetch Test Station by ID', props<{ id: string }>());
export const fetchTestStationSuccess = createAction('[API/test-stations] Fetch Test Station by ID Success', props<{ id: string; payload: TestStation }>());
export const fetchTestStationFailed = createAction('[API/test-stations] Fetch Test Station by ID Failed', props<GlobalError>());
