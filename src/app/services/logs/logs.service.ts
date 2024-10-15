import { version } from '@/package.json';
import { Injectable, inject } from '@angular/core';
import type { Log, LogsModel } from '@models/logs/logs.model';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { saveLog } from '@store/logs/logs.actions';
import { selectMergedRouteUrl } from '@store/router/router.selectors';
import { id } from '@store/user/user-service.reducer';
import { from, lastValueFrom, map } from 'rxjs';
import { filter, mergeMap, switchMap, toArray } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LogsProvider {
	private httpService = inject(HttpService);
	private store$ = inject(Store<LogsModel>);
	private oid = this.store$.selectSignal(id);

	public sendLogs = (logs: Log[]) => {
		if (!logs || logs?.length === 0) {
			return Promise.resolve(true);
		}

		return lastValueFrom(
			from(logs).pipe(
				filter((log: Log) => !log['unauthenticated']),
				mergeMap(async (log) => ({
					...log,
					source: 'VTM',
					appVersion: version,
					employeeId: this.oid(),
				})),
				toArray(),
				switchMap((authLogs: Log[]) => this.httpService.sendLogs(authLogs)),
				map(() => true)
			)
		);
	};

	public dispatchLog(log: Log): void {
		const url = this.store$.selectSignal(selectMergedRouteUrl)();

		const pageName = document.title.replace(/Vehicle Testing Management - /, '');

		this.store$.dispatch(saveLog({ ...log, url, pageName }));
	}
}
