import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import {
  Inject, Injectable, InjectionToken, Optional,
} from '@angular/core';
import { Observable, retry, timer } from 'rxjs';

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
}

interface InternalConfig extends Required<Pick<HttpRetryConfig, 'count' | 'delay' | 'backoff'>>, Pick<HttpRetryConfig, 'httpStatusRetry'> {}

@Injectable()
export class DelayedRetryInterceptor implements HttpInterceptor {
  config: InternalConfig;

  private readonly defaultConfig = { count: 3, delay: 2000, backoff: false };

  constructor(@Optional() @Inject(HTTP_RETRY_CONFIG) private retryConfig: HttpRetryConfig) {
    this.config = { ...this.defaultConfig, ...this.retryConfig };
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        delay: (error, retryCount: number) => this.retryHandler(error, retryCount, this.config),
      }),
    );
  }

  retryHandler(error: any, retryCount: number, config: InternalConfig) {
    const {
      delay, count, httpStatusRetry, backoff,
    } = config;
    const { status } = error;

    if (httpStatusRetry && !httpStatusRetry.includes(status)) {
      throw error;
    }

    if (retryCount >= count) {
      throw new Error('Request timed out. Check connectivity and try again.');
    }

    return timer(backoff ? delay * retryCount : delay);
  }
}
