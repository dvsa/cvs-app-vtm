import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Roles } from '@models/roles.enum';

interface TestField {
	testTypeStartTimestamp: string | null;
	testTypeName: string | null;
	testNumber?: string | null;
	testResult: TestResults | null;
	testResultId: string;
	testResultStatus?: TestStatus;
}

@Component({
	selector: 'app-test-record-summary',
	templateUrl: './test-record-summary.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, PaginationComponent, DatePipe],
})
export class TestRecordSummaryComponent {
	cdr = inject(ChangeDetectorRef);

	readonly isEditing = input(false);
	readonly testResults = input<TestResultSchema[]>([]);

	pageStart?: number;
	pageEnd?: number;

	public get roles(): typeof Roles {
		return Roles;
	}

	get numberOfRecords(): number {
		return this.testResults().length;
	}

	get paginatedTestFields(): TestField[] {
		return this.sortedTestTypeFields.slice(this.pageStart, this.pageEnd);
	}

	get sortedTestTypeFields(): TestField[] {
		const byDate = (a: TestField, b: TestField) =>
			new Date(b.testTypeStartTimestamp || 0).getTime() - new Date(a.testTypeStartTimestamp || 0).getTime();

		return this.testResults()
			.flatMap((record) =>
				record.testTypes.map((testType) => ({
					testTypeStartTimestamp: testType.testTypeStartTimestamp,
					testTypeName: testType.testTypeName,
					testNumber: testType.testNumber,
					testResult: testType.testResult,
					testResultId: record.testResultId,
					testResultStatus: record.testStatus,
				}))
			)
			.sort(byDate);
	}

	getResult(test: TestField) {
		return test.testResultStatus === TestStatus.CANCELLED ? TestStatus.CANCELLED : test.testResult;
	}

	getTestTypeName(testResult: TestResultSchema): string {
		return testResult.testTypes.map((t) => t.testTypeName).join(',');
	}

	getTestTypeResults(testResult: TestResultSchema): string {
		return testResult.testTypes.map((t) => t.testResult).join(',');
	}

	handlePaginationChange(event?: { start: number; end: number }): void {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}
}
