import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DelayedRetryInterceptor } from './delayed-retry.interceptor';

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

  static forRoot(config?: HttpRetryConfig): ModuleWithProviders<DelayedRetryModule> {
    return {
      ngModule: DelayedRetryModule,
      providers: [{ provide: HTTP_RETRY_CONFIG, useValue: config }]
    };
  }
}
