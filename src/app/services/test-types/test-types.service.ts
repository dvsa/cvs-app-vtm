import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_PATH, Configuration, TestTypesService as TestTypesApiService, TestTypesTaxonomy } from '@api/test-types';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { testTypeIdChanged } from '@store/test-records';
import { fetchTestTypes } from '@store/test-types/actions/test-types.actions';
import { selectTestTypesByVehicleType } from '@store/test-types/selectors/test-types.selectors';
import { Observable } from 'rxjs';

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

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.store.select(selectTestTypesByVehicleType);
  }

  fetchTestTypes(): void {
    this.store.dispatch(fetchTestTypes());
  }

  testTypeIdChanged(testTypeId: string): void {
    this.store.dispatch(testTypeIdChanged({ testTypeId }));
  }
}
