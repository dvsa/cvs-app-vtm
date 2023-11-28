import {
  Inject, Injectable, InjectionToken, Optional,
} from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private router: Router, @Optional() @Inject(HTTP_RESPONSE_REDIRECT) private redirectConfig: HttpResponseRedirectConfig) {
    this.config = { ...this.defaultConfig, ...this.redirectConfig };
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (this.config.httpStatusRedirect.includes(error.status)) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.router.navigateByUrl(this.config.redirectTo);
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
