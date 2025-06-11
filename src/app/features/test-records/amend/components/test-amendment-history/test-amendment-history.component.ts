import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Store, select } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { selectedTestSortedAmendmentHistory } from '@store/test-records/test-records.selectors';
import { Observable } from 'rxjs/internal/Observable';

@Component({
	selector: 'app-test-amendment-history',
	templateUrl: './test-amendment-history.component.html',
	imports: [RouterLink, AsyncPipe, DatePipe, DefaultNullOrEmpty],
})
export class TestAmendmentHistoryComponent {
	store = inject(Store);

	readonly testRecord = input<TestResultModel>();

	getCreatedByName(testResult: TestResultModel | undefined) {
		return testResult?.createdByName || testResult?.testerName;
	}

	get sortedTestHistory$(): Observable<TestResultModel[] | undefined> {
		return this.store.pipe(select(selectedTestSortedAmendmentHistory));
	}
}
