import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { defectsLoadingState } from '@store/defects';
import { referenceDataLoadingState } from '@store/reference-data';
import { requiredStandardsLoadingState } from '@store/required-standards/required-standards.selector';
import { getSpinner } from '@store/spinner/spinner.selectors';
import { selectTechRecordSearchLoadingState } from '@store/tech-record-search/tech-record-search.selector';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { testStationsLoadingState } from '@store/test-stations';
import { selectTestTypesLoadingState } from '@store/test-types/test-types.selectors';
import { combineLatest, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class LoadingService {
	private store = inject(Store);

	globalLoadingState$ = this.store.pipe(select(getSpinner));
	testResultLoadingState$ = this.store.pipe(select(testResultLoadingState));
	techRecordsLoadingState$ = this.store.pipe(select(technicalRecordsLoadingState));
	testTypesLoadingState$ = this.store.pipe(select(selectTestTypesLoadingState));
	testStationsLoadingState$ = this.store.pipe(select(testStationsLoadingState));
	defectsLoadingState$ = this.store.pipe(select(defectsLoadingState));
	referenceDataLoadingState$ = this.store.pipe(select(referenceDataLoadingState));
	techRecordSearchLoadingState$ = this.store.pipe(select(selectTechRecordSearchLoadingState));
	requiredStandardsLoadingState$ = this.store.pipe(select(requiredStandardsLoadingState));

	showSpinner$ = combineLatest([
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
