import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store, select } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { selectedTestSortedAmendmentHistory } from '@store/test-records/test-records.selectors';

@Component({
	selector: 'app-test-amendment-history',
	templateUrl: './test-amendment-history.component.html',
	imports: [RouterLink, AsyncPipe, DatePipe, DefaultNullOrEmpty],
})
export class TestAmendmentHistoryComponent {
	store = inject(Store);

	readonly testRecord = input<TestResultSchema>();

	sortedTestHistory$ = this.store.pipe(select(selectedTestSortedAmendmentHistory));

	getCreatedByName(testResult: TestResultSchema | undefined) {
		return testResult?.createdByName || testResult?.testerName;
	}
}
