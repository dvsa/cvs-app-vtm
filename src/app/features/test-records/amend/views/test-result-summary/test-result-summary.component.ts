import { Component, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, of, skipWhile, switchMap, take } from 'rxjs';

@Component({
	selector: 'app-test-result-summary',
	templateUrl: './test-result-summary.component.html',
	styleUrls: ['./test-result-summary.component.scss'],
})
export class TestResultSummaryComponent implements OnInit {
	testResult$: Observable<TestResultModel | undefined> = of(undefined);
	sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

	constructor(private testRecordsService: TestRecordsService) {}

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
