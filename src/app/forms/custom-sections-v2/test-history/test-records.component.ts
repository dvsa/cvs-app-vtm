import { DatePipe, TitleCasePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { Roles } from '@models/roles.enum';
import { TestResultStatus } from '@models/test-results/test-result-status.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { clearScrollPosition } from '@store/technical-records';

interface TestField {
	testTypeStartTimestamp: string | Date;
	testTypeName: string;
	testNumber: string;
	testResult: resultOfTestEnum;
	testResultId: string;
	testResultStatus?: TestResultStatus;
}

@Component({
	selector: 'app-test-records',
	templateUrl: './test-records.component.html',
	styleUrls: ['./test-records.component.scss'],
	imports: [ButtonComponent, RoleRequiredDirective, DatePipe, PaginationComponent, RouterLink, TitleCasePipe],
})
export class TestResultsComponent extends EditBaseComponent implements OnInit {
	testResults = input<TestResultModel[]>([]);
	techRecord = input.required<V3TechRecordModel>();
	isEditing = input(false);
	router = inject(Router);
	route = inject(ActivatedRoute);
	globalErrorService = inject(GlobalErrorService);
	viewportScroller = inject(ViewportScroller);
	cdr = inject(ChangeDetectorRef);
	form = this.fb.group({});
	isArchived = false;
	pageStart?: number;
	pageEnd?: number;

	ngOnInit(): void {
		const techRecord = this.techRecord();
		this.isArchived = techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED;
	}

	protected readonly Roles = Roles;

	showCreateTestButton(): boolean {
		return !this.isArchived;
	}

	async createTest(techRecord?: V3TechRecordModel): Promise<void> {
		this.store.dispatch(clearScrollPosition());
		if (
			(techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness === 'complete' ||
			(techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness === 'testable'
		) {
			await this.router.navigate(['test-records/create-test/type'], { relativeTo: this.route });
		} else {
			this.globalErrorService.setErrors([
				{
					error: this.getCreateTestErrorMessage(techRecord?.techRecord_hiddenInVta ?? false),
					anchorLink: 'create-test',
				},
			]);

			this.viewportScroller.scrollToPosition([0, 0]);
		}
	}

	private getCreateTestErrorMessage(hiddenInVta: boolean | undefined): string {
		if (hiddenInVta) {
			return 'Vehicle record is hidden in VTA. Show the vehicle record in VTA to start recording tests against it.';
		}
		return 'This vehicle does not have enough information to be tested. Please complete this record so tests can be recorded against it.';
	}

	get numberOfRecords(): number {
		return this.testResults().length;
	}

	get paginatedTestFields(): TestField[] {
		return this.sortedTestTypeFields.slice(this.pageStart, this.pageEnd);
	}

	get sortedTestTypeFields(): TestField[] {
		const byDate = (a: TestField, b: TestField) =>
			new Date(b.testTypeStartTimestamp).getTime() - new Date(a.testTypeStartTimestamp).getTime();

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

	getResult(test: TestField): string {
		return test.testResultStatus === TestResultStatus.CANCELLED ? TestResultStatus.CANCELLED : test.testResult;
	}

	handlePaginationChange(event?: { start: number; end: number }): void {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}
}
