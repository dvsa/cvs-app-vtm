import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { spinnerState } from '@store/spinner/reducers/spinner.reducer';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  globalLoadingState$: Observable<boolean>;
  testResultLoadingState$: Observable<boolean>;
  techRecordsLoadingState$: Observable<boolean>;

  constructor(private store: Store) {
    this.globalLoadingState$ = this.store.pipe(select(spinnerState));
    this.testResultLoadingState$ = this.store.pipe(select(testResultLoadingState));
    this.techRecordsLoadingState$ = this.store.pipe(select(technicalRecordsLoadingState));
  }

  private get reduceLoadingStates$() {
    return combineLatest([this.globalLoadingState$, this.testResultLoadingState$, this.techRecordsLoadingState$]).pipe(
      map((states) =>
        states.reduce((acc, cur) => {
          return acc || cur;
        }, false)
      )
    );
  }

  get showSpinner$(): Observable<boolean> {
    return this.reduceLoadingStates$;
  }
}
