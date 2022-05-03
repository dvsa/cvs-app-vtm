import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelayedRetryModule, HttpRetryInterceptorConfig } from './delayed-retry/delayed-retry.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, DelayedRetryModule.forRoot(new HttpRetryInterceptorConfig({ count: 3, delay: 2000, httpStatusRetry: [404] }))]
})
export class InterceptorModule {}
