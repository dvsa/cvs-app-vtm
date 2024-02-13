import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { defectsLoadingState } from '@store/defects';
import { referenceDataLoadingState } from '@store/reference-data';
import { getSpinner } from '@store/spinner/selectors/spinner.selectors';
import { selectTechRecordSearchLoadingState } from '@store/tech-record-search/selector/tech-record-search.selector';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { testStationsLoadingState } from '@store/test-stations';
import { selectTestTypesLoadingState } from '@store/test-types/selectors/test-types.selectors';
import { combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  store = inject(Store);

  globalLoadingState$ = this.store.pipe(select(getSpinner));
  testResultLoadingState$ = this.store.pipe(select(testResultLoadingState));
  techRecordsLoadingState$ = this.store.pipe(select(technicalRecordsLoadingState));
  testTypesLoadingState$ = this.store.pipe(select(selectTestTypesLoadingState));
  testStationsLoadingState$ = this.store.pipe(select(testStationsLoadingState));
  defectsLoadingState$ = this.store.pipe(select(defectsLoadingState));
  referenceDataLoadingState$ = this.store.pipe(select(referenceDataLoadingState));
  techRecordSearchLoadingState$ = this.store.pipe(select(selectTechRecordSearchLoadingState));

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

  get showSpinner$() {
    return this.reduceLoadingStates$;
  }
}
