import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LogType } from '@models/logs/logs.model';
import { Store } from '@ngrx/store';
import { LogsProvider } from '@services/logs/logs.service';
import { id } from '@store/user/user-service.reducer';
import { get } from 'lodash';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class ResponseLoggerInterceptor implements HttpInterceptor {
	private logsProvider = inject(LogsProvider);
	private oid = inject(Store).selectSignal(id);

	intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const start = Date.now();

		return next.handle(request).pipe(
			tap((event) => {
				// skip logging for local files
				if (request.url.includes('assets/') && request.url.endsWith('.json')) return;

				const finish = Date.now();

				if (event instanceof HttpResponse) {
					this.logsProvider.dispatchLog({
						type: LogType.INFO,
						message: `${this.oid()} - ${event.status} ${event.statusText} for API call to ${event.url}`,
						timestamp: Date.now(),
					});
				}

				const requestDuration = this.getRequestDuration(finish, start);

				// if the request took longer than the threshold, log the request
				if (requestDuration > this.threshold) {
					this.logsProvider.dispatchLog({
						timestamp: Date.now(),
						oid: this.oid(),
						type: LogType.WARN,
						detail: 'Long Request',
						message: `Request to ${request.url} is taking longer than ${this.threshold / 1000} seconds`,
						requestDurationInMs: requestDuration,
					});
				}
			}),
			catchError((err) => {
				const status = err instanceof HttpErrorResponse ? err.status : 0;

				const message = err instanceof HttpErrorResponse || err instanceof Error ? err.message : JSON.stringify(err);

				this.logsProvider.dispatchLog({
					type: LogType.ERROR,
					message: `${this.oid()} - Method: ${request.method}. ${message}.`,
					status,
					timestamp: Date.now(),
					errors: err instanceof HttpErrorResponse ? err.error : get(err, 'error.errors', undefined),
					stackTrace: err instanceof Error ? err.stack : undefined,
				});

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
