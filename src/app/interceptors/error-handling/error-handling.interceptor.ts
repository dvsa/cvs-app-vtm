import { Inject, Injectable, Optional } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpResponseRedirectConfig, HTTP_RESPONSE_REDIRECT } from './error-handling.module';

interface InternalConfig extends Required<Pick<HttpResponseRedirectConfig, 'httpStatusRedirect' | 'redirectTo'>> {}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  config: InternalConfig;

  private readonly defaultConfig = { httpStatusRedirect: [500], redirectTo: 'error' };

  constructor(private router: Router, @Optional() @Inject(HTTP_RESPONSE_REDIRECT) private config_: HttpResponseRedirectConfig) {
    this.config = { ...this.defaultConfig, ...this.config_ };
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (this.config.httpStatusRedirect.includes(error.status)) {
            this.router.navigateByUrl(this.config.redirectTo);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
