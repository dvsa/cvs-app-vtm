import { HttpErrorResponse } from '@angular/common/http';
import type { Log } from '@models/logs/logs.model';
import { createAction } from '@ngrx/store';

export const saveLog = createAction('[GLOBAL] Save Log', (log: Log) => ({ log }));

export const startSendingLogs = createAction('[AppComponent] Start Sending Logs');

export const sendLogs = createAction('[LogsEffects] Send Logs');

export const sendLogsSuccess = createAction('[LogsEffects] Send Logs Success');

export const sendLogsFailure = createAction('[LogsEffects] Send Logs Failure', (error: Error | HttpErrorResponse) => ({
	error,
}));
