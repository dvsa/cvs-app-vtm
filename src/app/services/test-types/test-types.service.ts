import { Inject, Injectable, Optional } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { BASE_PATH, Configuration, TestType, TestTypeCategory, TestTypesService as TestTypesApiService } from '@api/test-types';
import { HttpClient } from '@angular/common/http';
import { fetchTestTypes } from '@store/test-types/actions/test-types.actions';
import { formatData, selectAllTestTypes } from '@store/test-types/selectors/test-types.selectors';
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
    this.store.dispatch(fetchTestTypes())
  }
  get vehicleTypes$(): Observable<{ [key: string]: Array<{ name: string; id: string }> }> {
    return this.store.pipe(select(formatData));
  }

  get selectAllTestTypes$(): Observable<Array<TestType | TestTypeCategory>> {
    return this.store.pipe(select(selectAllTestTypes));
  }
}
