import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Configuration } from './configuration';
import { ReferenceDataApiService } from './api/reference-data-api.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ReferenceDataApiService]
})
export class ReferenceDataApiModule {
  public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ReferenceDataApiModule> {
    return {
      ngModule: ReferenceDataApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ReferenceDataApiModule, @Optional() http: HttpClient) {
    if (parentModule) {
      throw new Error('ReferenceDataApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' + 'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
