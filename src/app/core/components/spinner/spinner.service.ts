import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getSpinner } from '@store/spinner/selectors/spinner.selectors';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { selectTestTypesLoadingState } from '@store/test-types/selectors/test-types.selectors';
import { combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  globalLoadingState$: Observable<boolean>;
  testResultLoadingState$: Observable<boolean>;
  techRecordsLoadingState$: Observable<boolean>;
  testTypesLoadingState$: Observable<boolean>;

  constructor(private store: Store) {
    this.globalLoadingState$ = this.store.pipe(select(getSpinner));
    this.testResultLoadingState$ = this.store.pipe(select(testResultLoadingState));
    this.techRecordsLoadingState$ = this.store.pipe(select(technicalRecordsLoadingState));
    this.testTypesLoadingState$ = this.store.pipe(select(selectTestTypesLoadingState));
  }

  private get reduceLoadingStates$() {
    return combineLatest([this.globalLoadingState$, this.testResultLoadingState$, this.techRecordsLoadingState$, this.testTypesLoadingState$]).pipe(
      map(states => states.some(b => b))
    );
  }

  get showSpinner$(): Observable<boolean> {
    return this.reduceLoadingStates$;
  }
}
