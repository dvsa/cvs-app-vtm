import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_PATH, Configuration, TestTypesService as TestTypesApiService, TestTypesTaxonomy } from '@api/test-types';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
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

  fetchTestTypes(): void {
    this.store.dispatch(fetchTestTypes());
  }

  get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
    return this.store.pipe(select(selectTestTypesByVehicleType));
  }
}
