import { DatePipe, TitleCasePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { Roles } from '@models/roles.enum';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { UserService } from '@services/user-service/user-service';
import { clearScrollPosition } from '@store/technical-records';
import { take } from 'rxjs';

interface TestField {
	testTypeStartTimestamp: string | null;
	testTypeName: string;
	testNumber: string;
	testResult: TestResults;
	testResultId: string;
	testResultStatus?: TestStatus;
}

@Component({
	selector: 'app-test-records',
	templateUrl: './test-records.component.html',
	styleUrls: ['./test-records.component.scss'],
	imports: [ButtonComponent, RoleRequiredDirective, DatePipe, PaginationComponent, RouterLink, TitleCasePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestResultsComponent extends EditBaseComponent implements OnInit {
	testResults = input<TestResultSchema[]>([]);
	techRecord = input.required<V3TechRecordModel>();
	isEditing = input(false);
	router = inject(Router);
	route = inject(ActivatedRoute);
	globalErrorService = inject(GlobalErrorService);
	viewportScroller = inject(ViewportScroller);
	cdr = inject(ChangeDetectorRef);
	userService = inject(UserService);
	form = this.fb.group({});
	isArchived = false;
	pageStart?: number;
	pageEnd?: number;
	hasTestResultAmend: boolean | undefined = false;

	ngOnInit(): void {
		const techRecord = this.techRecord();
		this.isArchived = techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED;
		this.userService.roles$.pipe(take(1)).subscribe((storedRoles) => {
			this.hasTestResultAmend = storedRoles?.some((role) => {
				return Roles.TestResultAmend.split(',').includes(role);
			});
			// roles$ may resolve asynchronously; mark for check so OnPush picks up the update.
			this.cdr.markForCheck();
		});
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
		return this.hasTestResultAmend
			? 'This vehicle does not have enough information to be tested. Please complete this record so tests can be recorded against it.'
			: 'This vehicle does not have enough information to be tested.' +
					' Call the Contact Centre to complete this record so tests can be recorded against it.';
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
				record.testTypes.map(
					(testType) =>
						({
							testTypeStartTimestamp: testType.testTypeStartTimestamp,
							testTypeName: testType.testTypeName,
							testNumber: testType.testNumber,
							testResult: testType.testResult,
							testResultId: record.testResultId,
							testResultStatus: record.testStatus,
						}) as TestField
				)
			)
			.sort(byDate);
	}

	getResult(test: TestField): string {
		return test.testResultStatus === TestStatus.CANCELLED ? TestStatus.CANCELLED : test.testResult;
	}

	handlePaginationChange(event?: { start: number; end: number }): void {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}
}
