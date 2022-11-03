import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelayedRetryModule } from './delayed-retry/delayed-retry.module';
import { ErrorInterceptorModule } from './error-handling/error-handling.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DelayedRetryModule.forRoot({ count: 3, delay: 2000, httpStatusRetry: [504], backoff: true }),
    ErrorInterceptorModule.forRoot({ httpStatusRedirect: [500], route: 'error' })
  ]
})
export class InterceptorModule {}
