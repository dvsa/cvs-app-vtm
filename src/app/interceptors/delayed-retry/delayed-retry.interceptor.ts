import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, timer } from 'rxjs';
import { HttpRetryInterceptorConfig } from './delayed-retry.module';

@Injectable()
export class DelayedRetryInterceptor implements HttpInterceptor {
  constructor(private config: HttpRetryInterceptorConfig) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        delay: (error: any, retryCount: number) => this.retryHandler(error, retryCount, this.config)
      })
    );
  }

  retryHandler(error: any, retryCount: number, config: HttpRetryInterceptorConfig) {
    const { delay, count, httpStatusRetry, backoff } = config;
    const { status } = error;

    if (httpStatusRetry && !httpStatusRetry.includes(status)) {
      throw error;
    }

    if (retryCount >= count) {
      throw 'Request timed out. Check connectivity and try again.';
    }

    return timer(backoff ? delay * retryCount : delay);
  }
}
