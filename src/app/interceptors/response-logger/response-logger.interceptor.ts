import { version } from '@/package.json';
import {
	HttpErrorResponse,
	type HttpEvent,
	HttpHandler,
	type HttpInterceptor,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { LogType } from '@models/logs/logs.model';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { selectMergedRouteUrl } from '@store/router/router.selectors';
import { id } from '@store/user/user-service.reducer';
import { get } from 'lodash';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class ResponseLoggerInterceptor implements HttpInterceptor {
	private httpService = inject(HttpService);
	private store = inject(Store);
	private oid = this.store.selectSignal(id);
	private url = this.store.selectSignal(selectMergedRouteUrl);

	intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		// Skip intercepting requests to the logging endpoint
		if (request.url === `${environment.VTM_API_URI}/log`) {
			return next.handle(request);
		}

		const start = Date.now();

		const baseLog = {
			source: 'VTM',
			appVersion: version,
			employeeId: this.oid(),
			url: this.url(),
			pageName: document.title.replace(/Vehicle Testing Management - /, ''),
			timestamp: Date.now(),
		};

		return next.handle(request).pipe(
			// filter(() => localStorage.getItem('isAutomation') !== 'true'), // skip logging for automation
			tap((event) => {
				// skip logging for local files
				if (request.url.includes('assets/') && request.url.endsWith('.json')) return;

				const finish = Date.now();

				if (event instanceof HttpResponse) {
					void this.httpService.sendLogs([
						{
							...baseLog,
							type: LogType.INFO,
							message: `${this.oid()} - ${event.status} ${event.statusText} for API call to ${event.url}`,
						},
					]);
				}

				const requestDuration = this.getRequestDuration(finish, start);

				// if the request took longer than the threshold, log the request
				if (requestDuration > this.threshold) {
					void this.httpService.sendLogs([
						{
							...baseLog,
							oid: this.oid(),
							type: LogType.WARN,
							detail: 'Long Request',
							message: `Request to ${request.url} is taking longer than ${this.threshold / 1000} seconds`,
							requestDurationInMs: requestDuration,
						},
					]);
				}
			}),
			catchError((err) => {
				const message = err instanceof HttpErrorResponse || err instanceof Error ? err.message : JSON.stringify(err);

				void this.httpService.sendLogs([
					{
						...baseLog,
						type: LogType.ERROR,
						message: `${this.oid()} - ${message}`,
						status: err instanceof HttpErrorResponse ? err.status : 0,
						errors: get(err, 'error.errors', undefined),
					},
				]);

				return throwError(() => err);
			})
		);
	}

	get threshold(): number {
		return 10_000; // 10 seconds in milliseconds
	}

	// separated out to allow simplified spies in tests
	getRequestDuration(finish: number, start: number): number {
		return finish - start;
	}
}
