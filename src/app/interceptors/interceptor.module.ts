import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelayedRetryModule } from './delayed-retry/delayed-retry.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, DelayedRetryModule.forRoot({ count: 3, delay: 2000, httpStatusRetry: [504], backoff: true })]
})
export class InterceptorModule {}
