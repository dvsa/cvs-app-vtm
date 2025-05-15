import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import type { LogsModel } from '@models/logs/logs.model';
import { STORE_FEATURE_LOGS_KEY } from '@store/logs/logs.feature';
import * as logsActions from './logs.actions';

export const initialState: LogsModel = [];

export const logsReducer = createReducer(
	initialState,
	on(logsActions.saveLog, (state: LogsModel, { log }) => [...state, log]),
	on(logsActions.sendLogsSuccess, () => initialState)
);

export const getLogsState = createFeatureSelector<LogsModel>(STORE_FEATURE_LOGS_KEY);
