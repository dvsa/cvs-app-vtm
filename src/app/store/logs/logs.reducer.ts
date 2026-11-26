import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import type { LogsModel } from '@models/logs/logs.model';
import { STORE_FEATURE_LOGS_KEY } from '@store/logs/logs.feature';
import * as logsActions from './logs.actions';

export const initialState: LogsModel = [];
const MAX_LOGS = 500;

export const logsReducer = createReducer(
	initialState,
	on(logsActions.saveLog, (state: LogsModel, { log }) => {
		const next = [...state, log];
		return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next;
	}),
	on(logsActions.sendLogsSuccess, () => initialState)
);

export const getLogsState = createFeatureSelector<LogsModel>(STORE_FEATURE_LOGS_KEY);
