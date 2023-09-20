import {
  NgModule, ModuleWithProviders, SkipSelf, Optional,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from './configuration';

import { ArchiveTestResultsService } from './api/archiveTestResults.service';
import { DefaultService } from './api/default.service';
import { GetTestResultsService } from './api/getTestResults.service';
import { UpdateTestResultsService } from './api/updateTestResults.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    ArchiveTestResultsService,
    DefaultService,
    GetTestResultsService,
    UpdateTestResultsService],
})
export class ApiModule {
  public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  constructor(
  @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient,
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n'
            + 'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
