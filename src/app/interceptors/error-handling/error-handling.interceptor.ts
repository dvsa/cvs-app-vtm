import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

export const HTTP_RESPONSE_REDIRECT = new InjectionToken<HttpResponseRedirectConfig>('HttpResponseRedirectConfig');

export interface HttpResponseRedirectConfig {
	/**
	 * The status codes to check for.
	 */
	httpStatusRedirect?: Array<number>;
	/**
	 * The route to redirect to
	 */
	redirectTo?: string;
}
type InternalConfig = Required<Pick<HttpResponseRedirectConfig, 'httpStatusRedirect' | 'redirectTo'>>;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	config: InternalConfig;

	private readonly defaultConfig = { httpStatusRedirect: [500], redirectTo: 'error' };

	constructor(
		private router: Router,
		@Optional() @Inject(HTTP_RESPONSE_REDIRECT) private redirectConfig: HttpResponseRedirectConfig
	) {
		this.config = { ...this.defaultConfig, ...this.redirectConfig };
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((error) => {
				if (error instanceof HttpErrorResponse) {
					if (this.config.httpStatusRedirect.includes(error.status)) {
						void this.router.navigateByUrl(this.config.redirectTo);
					}
				}
				return throwError(() => error);
			})
		);
	}
}
