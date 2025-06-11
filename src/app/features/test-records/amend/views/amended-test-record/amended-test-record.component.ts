import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BannerComponent } from '@components/banner/banner.component';
import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, firstValueFrom, of } from 'rxjs';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';

@Component({
	selector: 'app-amended-test-record',
	templateUrl: './amended-test-record.component.html',
	imports: [BannerComponent, BaseTestRecordComponent, AsyncPipe, DatePipe],
})
export class AmendedTestRecordComponent implements OnInit {
	testRecordsService = inject(TestRecordsService);

	testResult$: Observable<TestResultModel | undefined> = of(undefined);
	defects$: Observable<TestResultDefects | undefined> = of(undefined);
	sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

	async ngOnInit() {
		this.testResult$ = this.testRecordsService.amendedTestResult$;
		this.defects$ = this.testRecordsService.amendedDefectData$;
		this.testRecordsService.editingTestResult((await firstValueFrom(this.testResult$)) as TestResultModel);
	}
}
