import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, retry, timer } from 'rxjs';
import { HttpRetryConfig, HTTP_RETRY_CONFIG } from './delayed-retry.module';

interface InternalConfig extends Required<Pick<HttpRetryConfig, 'count' | 'delay' | 'backoff'>>, Pick<HttpRetryConfig, 'httpStatusRetry'> {}

@Injectable()
export class DelayedRetryInterceptor implements HttpInterceptor {
  config: InternalConfig;

  private readonly defaultConfig = { count: 3, delay: 2000, backoff: false };

  constructor(@Optional() @Inject(HTTP_RETRY_CONFIG) private config_: HttpRetryConfig) {
    this.config = { ...this.defaultConfig, ...this.config_ };
    console.log(this.config);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        delay: (error: any, retryCount: number) => this.retryHandler(error, retryCount, this.config)
      })
    );
  }

  retryHandler(error: any, retryCount: number, config: InternalConfig) {
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
