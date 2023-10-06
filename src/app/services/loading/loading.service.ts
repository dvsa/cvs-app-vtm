import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getSpinner } from '@store/spinner/selectors/spinner.selectors';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { selectTestTypesLoadingState } from '@store/test-types/selectors/test-types.selectors';
import { testStationsLoadingState } from '@store/test-stations';
import { defectsLoadingState } from '@store/defects';
import { combineLatest, map, Observable } from 'rxjs';
import { referenceDataLoadingState } from '@store/reference-data';
import { selectTechRecordSearchLoadingState } from '@store/tech-record-search/selector/tech-record-search.selector';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  globalLoadingState$: Observable<boolean> = this.store.pipe(select(getSpinner));
  testResultLoadingState$: Observable<boolean> = this.store.pipe(select(testResultLoadingState));
  techRecordsLoadingState$: Observable<boolean> = this.store.pipe(select(technicalRecordsLoadingState));
  testTypesLoadingState$: Observable<boolean> = this.store.pipe(select(selectTestTypesLoadingState));
  testStationsLoadingState$: Observable<boolean> = this.store.pipe(select(testStationsLoadingState));
  defectsLoadingState$: Observable<boolean> = this.store.pipe(select(defectsLoadingState));
  referenceDataLoadingState$: Observable<boolean> = this.store.pipe(select(referenceDataLoadingState));
  techRecordSearchLoadingState$: Observable<boolean> = this.store.pipe(select(selectTechRecordSearchLoadingState));

  constructor(private store: Store) {}

  private get reduceLoadingStates$() {
    return combineLatest([
      this.globalLoadingState$,
      this.testResultLoadingState$,
      this.techRecordsLoadingState$,
      this.testTypesLoadingState$,
      this.testStationsLoadingState$,
      this.defectsLoadingState$,
      this.referenceDataLoadingState$,
      this.techRecordSearchLoadingState$,
    ]).pipe(map((states) => states.some((b) => b)));
  }

  get showSpinner$(): Observable<boolean> {
    return this.reduceLoadingStates$;
  }
}
