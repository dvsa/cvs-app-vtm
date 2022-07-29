import { Inject, Injectable, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { BASE_PATH, Configuration, TestTypesService as TestTypesApiService } from '@api/test-types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestTypesService extends TestTypesApiService {
  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
    private store: Store<State>
  ) {
    super(httpClient, basePath, configuration);
  }
}
