import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DelayedRetryInterceptor } from './delayed-retry.interceptor';

export interface HttpRetryConfig {
  count?: number;
  delay?: number;
  httpStatusRetry?: Array<number>;
}

export class HttpRetryInterceptorConfig implements HttpRetryConfig {
  readonly count: number;
  readonly delay: number;
  readonly httpStatusRetry: number[];

  private readonly defaultConfig = { count: 3, delay: 2000, httpStatusRetry: [] };

  constructor(@Optional() private config?: HttpRetryConfig) {
    this.count = this.config?.count ?? this.defaultConfig.count;
    this.delay = this.config?.delay ?? this.defaultConfig.delay;
    this.httpStatusRetry = this.config?.httpStatusRetry ?? this.defaultConfig.httpStatusRetry;
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
