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
    const { delay, count, httpStatusRetry } = config;
    const { status } = error;

    if (httpStatusRetry.includes(status)) {
      if (retryCount < count) {
        return timer(delay);
      } else {
        throw `Reached maximum number of attemps (${count}). Please try again later.`;
      }
    }

    throw error;
  }
}
