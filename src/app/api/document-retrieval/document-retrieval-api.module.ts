import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DocumentRetrievalService } from './api/document-retrieval.service';
import { Configuration } from './configuration';

@NgModule({
	imports: [],
	declarations: [],
	exports: [],
	providers: [DocumentRetrievalService],
})
export class DocumentRetrievalApiModule {
	public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<DocumentRetrievalApiModule> {
		return {
			ngModule: DocumentRetrievalApiModule,
			providers: [{ provide: Configuration, useFactory: configurationFactory }],
		};
	}

	constructor(@Optional() @SkipSelf() parentModule: DocumentRetrievalApiModule, @Optional() http: HttpClient) {
		if (parentModule) {
			throw new Error('DocumentRetrievalApiModule is already loaded. Import in your base AppModule only.');
		}
		if (!http) {
			throw new Error(
				'You need to import the HttpClientModule in your AppModule! \n' +
					'See also https://github.com/angular/angular/issues/20575'
			);
		}
	}
}
