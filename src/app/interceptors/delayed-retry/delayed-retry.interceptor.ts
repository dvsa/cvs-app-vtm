import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { retryInterceptorFailure } from '@store/retry-interceptor/actions/retry-interceptor.actions';
import { setSpinnerState } from '@store/spinner/actions/spinner.actions';
import { Observable, retry, throwError, timer } from 'rxjs';

export const HTTP_RETRY_CONFIG = new InjectionToken<HttpRetryConfig>('HttpRetryConfig');

export interface HttpRetryConfig {
	/**
	 * The maximum number of times to retry.
	 */
	count?: number;
	/**
	 * The number of milliseconds to delay before retrying.
	 */
	delay?: number;
	/**
	 * Array of http status codes to retry. If undefined, all requests are retried.
	 */
	httpStatusRetry?: Array<number>;
	/**
	 * If true, each retry delay will be multiplied by the current retry count.
	 */
	backoff?: boolean;

	whiteList?: string[];
}

interface InternalConfig
	extends Required<Pick<HttpRetryConfig, 'count' | 'delay' | 'backoff'>>,
		Pick<HttpRetryConfig, 'httpStatusRetry'> {
	whiteList: string[];
}

@Injectable()
export class DelayedRetryInterceptor implements HttpInterceptor {
	config: InternalConfig;

	private readonly defaultConfig = {
		count: 3,
		delay: 2000,
		backoff: false,
		whiteList: [],
	};

	constructor(
		@Optional() @Inject(HTTP_RETRY_CONFIG) private retryConfig: HttpRetryConfig,
		private store: Store<State>
	) {
		this.config = { ...this.defaultConfig, ...this.retryConfig };
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			retry({
				delay: (error, retryCount: number) => {
					try {
						return this.retryHandler(error, retryCount, this.config, request);
					} catch (httpError: unknown) {
						return throwError(() => {
							this.store.dispatch(setSpinnerState({ showSpinner: false }));
							this.store.dispatch(retryInterceptorFailure({ error }));
							return httpError;
						});
					}
				},
			})
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	retryHandler(error: any, retryCount: number, config: InternalConfig, request: HttpRequest<unknown>) {
		const { delay, count, httpStatusRetry, backoff, whiteList } = config;
		const { status } = error;

		if (retryCount < count && whiteList.some((url) => request.url.includes(url))) {
			return timer(backoff ? delay * retryCount : delay);
		}

		if (httpStatusRetry && !httpStatusRetry.includes(status)) {
			throw error;
		}

		if (retryCount >= count) {
			throw new Error('Request timed out. Check connectivity and try again.');
		}
		return timer(backoff ? delay * retryCount : delay);
	}
}
