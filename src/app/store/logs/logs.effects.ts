import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { LogsProvider } from '@services/logs/logs.service';
import { getLogsState } from '@store/logs/logs.reducer';
import { forkJoin, interval, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import * as logsActions from './logs.actions';

@Injectable()
export class LogsEffects {
	private static readonly MINUTE = 60 * 1000;

	private static readonly isAutomation = localStorage.getItem('isAutomation') === 'true';

	private actions$ = inject(Actions);
	private store$ = inject(Store);
	private logsProvider = inject(LogsProvider);

	startSendingLogsEffect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(logsActions.startSendingLogs),
			switchMap(() => interval(LogsEffects.MINUTE).pipe(map(() => logsActions.sendLogs())))
		)
	);

	sendLogsEffect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(logsActions.sendLogs),
			filter(() => !LogsEffects.isAutomation),
			concatLatestFrom(() => this.store$.pipe(select(getLogsState))),
			switchMap(([_, logs]) =>
				forkJoin([this.logsProvider.sendLogs(logs)]).pipe(
					map(() => logsActions.sendLogsSuccess()),
					catchError((err) => of(logsActions.sendLogsFailure(err)))
				)
			)
		)
	);
}
