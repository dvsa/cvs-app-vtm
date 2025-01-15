import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelayedRetryModule } from './delayed-retry/delayed-retry.module';
import { ErrorInterceptorModule } from './error-handling/error-handling.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		DelayedRetryModule.forRoot({
			count: 3,
			delay: 2000,
			httpStatusRetry: [0, 504],
			backoff: true,
			whiteList: ['document-retrieval'],
		}),
		// @TODO - Remove blacklisted paths once source of 500 errors are resolved
		ErrorInterceptorModule.forRoot({
			httpStatusRedirect: [500],
			redirectTo: 'error',
			blacklist: ['/test-types/', '/v3/technical-records/recalls/'],
		}),
	],
})
export class InterceptorModule {}
