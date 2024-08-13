import { Component, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, firstValueFrom, of } from 'rxjs';

@Component({
	selector: 'app-amended-test-record',
	templateUrl: './amended-test-record.component.html',
})
export class AmendedTestRecordComponent implements OnInit {
	testResult$: Observable<TestResultModel | undefined> = of(undefined);
	defects$: Observable<TestResultDefects | undefined> = of(undefined);
	sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

	constructor(private testRecordsService: TestRecordsService) {}

	async ngOnInit() {
		this.testResult$ = this.testRecordsService.amendedTestResult$;
		this.defects$ = this.testRecordsService.amendedDefectData$;
		this.testRecordsService.editingTestResult((await firstValueFrom(this.testResult$)) as TestResultModel);
	}
}
