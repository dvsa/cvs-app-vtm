import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TestResultModel } from '@models/test-results/test-result.model';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, of, skipWhile, switchMap, take } from 'rxjs';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';
import { TestAmendmentHistoryComponent } from '../../components/test-amendment-history/test-amendment-history.component';

@Component({
	selector: 'app-test-result-summary',
	templateUrl: './test-result-summary.component.html',
	styleUrls: ['./test-result-summary.component.scss'],
	imports: [BaseTestRecordComponent, TestAmendmentHistoryComponent, AsyncPipe],
})
export class TestResultSummaryComponent implements OnInit {
	testRecordsService = inject(TestRecordsService);

	testResult$: Observable<TestResultModel | undefined> = of(undefined);
	sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

	ngOnInit(): void {
		this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
			switchMap((editingTestResult) =>
				editingTestResult ? of(editingTestResult) : this.testRecordsService.testResult$
			)
		);

		this.testResult$
			.pipe(
				skipWhile((testResult) => !testResult),
				take(1)
			)
			.subscribe((testResult) => this.testRecordsService.editingTestResult(testResult as TestResultModel));

		this.sectionTemplates$ = this.testRecordsService.sectionTemplates$;
	}
}
