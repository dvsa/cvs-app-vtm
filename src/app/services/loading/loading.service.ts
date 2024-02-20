import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { defectsLoadingState } from '@store/defects';
import { referenceDataLoadingState } from '@store/reference-data';
import { requiredStandardsLoadingState } from '@store/required-standards/selectors/required-standards.selector';
import { getSpinner } from '@store/spinner/selectors/spinner.selectors';
import { selectTechRecordSearchLoadingState } from '@store/tech-record-search/selector/tech-record-search.selector';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { testStationsLoadingState } from '@store/test-stations';
import { selectTestTypesLoadingState } from '@store/test-types/selectors/test-types.selectors';
import { combineLatest, map, Observable } from 'rxjs';

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
  requiredStandardsLoadingState$: Observable<boolean> = this.store.pipe(select(requiredStandardsLoadingState));

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
      this.requiredStandardsLoadingState$,
    ]).pipe(map((states) => states.some((b) => b)));
  }

  get showSpinner$(): Observable<boolean> {
    return this.reduceLoadingStates$;
  }
}
