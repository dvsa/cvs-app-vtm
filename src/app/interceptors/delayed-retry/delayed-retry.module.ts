import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DelayedRetryInterceptor } from './delayed-retry.interceptor';

/**
 *
 */
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

export class HttpRetryInterceptorConfig implements HttpRetryConfig {
  readonly count: number;
  readonly delay: number;
  readonly httpStatusRetry?: number[] | undefined;
  readonly backoff: boolean;

  private readonly defaultConfig = { count: 3, delay: 2000, backoff: false };

  constructor(@Optional() private config?: HttpRetryConfig) {
    this.count = this.config?.count ?? this.defaultConfig.count;
    this.delay = this.config?.delay ?? this.defaultConfig.delay;
    this.backoff = this.config?.backoff ?? this.defaultConfig.backoff;

    if (this.config?.httpStatusRetry) {
      this.httpStatusRetry = this.config.httpStatusRetry;
    }
  }
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DelayedRetryInterceptor,
      multi: true
    }
  ]
})
export class DelayedRetryModule {
  constructor(@Optional() @SkipSelf() parentModule?: DelayedRetryModule) {
    if (parentModule) {
      throw new Error('DelayedRetryModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: HttpRetryInterceptorConfig): ModuleWithProviders<DelayedRetryModule> {
    return {
      ngModule: DelayedRetryModule,
      providers: [{ provide: HttpRetryInterceptorConfig, useValue: config }]
    };
  }
}
