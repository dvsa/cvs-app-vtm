import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CompressionHeaders } from '@dvsa/cvs-microservice-common/api/headers';
import { LogType } from '@models/logs/logs.model';
import { Store } from '@ngrx/store';
import { CompressionService } from '@services/compression/compression.service';
import { LogsProvider } from '@services/logs/logs.service';
import { id } from '@store/user/user-service.reducer';
import { get } from 'lodash';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ResponseLoggerInterceptor implements HttpInterceptor {
	private readonly logsProvider = inject(LogsProvider);
	private readonly compression = inject(CompressionService);
	private readonly oid = inject(Store).selectSignal(id);

	intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const start = Date.now();

		let modifiedRequest: HttpRequest<T | string> = request;

		if (request.headers.get(CompressionHeaders.outbound.request) === CompressionHeaders.compressionValue) {
			try {
				// clone the request with compressed body - header optimistically attached in HttpService
				modifiedRequest = request.clone({ body: this.compression.compress(request.body) });
			} catch (err) {
				this.logsProvider.dispatchLog({
					type: LogType.ERROR,
					message: 'Could not compress request payload',
					body: request.body,
					err,
				});

				// if the compression logic throws, then remove the header indicating it's been encoded
				modifiedRequest = request.clone({
					headers: request.headers.delete(CompressionHeaders.outbound.request),
				});
			}
		}

		return next.handle(modifiedRequest).pipe(
			map((event) => {
				// skip logging for local files
				if (modifiedRequest.url.includes('assets/') && modifiedRequest.url.endsWith('.json')) return event;

				const finish = Date.now();

				const requestDuration = this.getRequestDuration(finish, start);

				// if the request took longer than the threshold, log the request
				if (requestDuration > this.threshold) {
					this.logsProvider.dispatchLog({
						timestamp: Date.now(),
						oid: this.oid(),
						type: LogType.WARN,
						detail: 'Long Request',
						message: `Request to ${modifiedRequest.url} is taking longer than ${this.threshold / 1000} seconds`,
						requestDurationInMs: requestDuration,
					});
				}

				if (event instanceof HttpResponse) {
					this.logsProvider.dispatchLog({
						type: LogType.INFO,
						message: `${this.oid()} - ${event.status} ${event.statusText} for API call to ${event.url}`,
						timestamp: Date.now(),
					});

					try {
						// check if the response headers contain the 'Content-Encoding' header with the value 'base64+gzip'
						if (typeof event.body === 'string' && event.headers?.get('Content-Encoding') === 'base64+gzip') {
							return event.clone({ body: this.compression.extract(event.body) });
						}
					} catch (err) {
						this.logsProvider.dispatchLog({
							type: LogType.ERROR,
							message: 'Could not decompress payload',
							body: event.body,
							headers: event.headers,
							err,
						});
					}
				}

				return event;
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
