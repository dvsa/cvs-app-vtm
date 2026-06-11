import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { GlobalWarning } from '@/src/app/core/components/global-warning/global-warning.interface';
import { GlobalWarningService } from '@/src/app/core/components/global-warning/global-warning.service';
import { TEST_TYPES_ALL_DESK_BASED_TESTS, TEST_TYPES_GROUP15_16 } from '@/src/app/models/testTypeId.enum';
import { ResultOfTestService } from '@/src/app/services/result-of-test/result-of-test.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { techRecord } from '@/src/app/store/technical-records';
import {
	cleanTestResultPayload,
	createTestResult,
	selectedTestResultState,
	testResultInEdit,
	toEditOrNotToEdit,
	updateTestResultSuccess,
} from '@/src/app/store/test-records';
import { selectTestType } from '@/src/app/store/test-types/test-types.selectors';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionControlComponent } from '@components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@components/accordion/accordion.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TestAmendmentHistoryComponent } from '@features/test-records/amend/components/test-amendment-history/test-amendment-history.component';
import { DefectsComponent } from '@features/test-records/custom-sections/defects/defects.component';
import { NotesComponent } from '@features/test-records/custom-sections/notes/notes.component';
import { ReasonForCreationComponent } from '@features/test-records/custom-sections/reason-for-creation/reason-for-creation.component';
import { TestComponent } from '@features/test-records/custom-sections/test/test.component';
import { VehicleComponent } from '@features/test-records/custom-sections/vehicle/vehicle.component';
import { VisitComponent } from '@features/test-records/custom-sections/visit/visit.component';
import { Modes } from '@models/modes.enum';
import { Roles } from '@models/roles.enum';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';
import { AbandonComponent } from '../../../../custom-sections/abandon/abandon.component';

@Component({
	selector: 'app-test-record-v2',
	templateUrl: './test-record-v2.component.html',
	styleUrls: ['./test-record-v2.component.scss'],
	imports: [
		ReasonForCreationComponent,
		FormsModule,
		ReactiveFormsModule,
		AccordionControlComponent,
		AccordionComponent,
		NgTemplateOutlet,
		DefectsComponent,
		NotesComponent,
		VisitComponent,
		VehicleComponent,
		TestComponent,
		ButtonGroupComponent,
		ButtonComponent,
		VehicleHeaderComponent,
		BannerComponent,
		AbandonComponent,
		AsyncPipe,
		RoleRequiredDirective,
		TestAmendmentHistoryComponent,
	],
})
export class TestRecordV2Component implements OnDestroy, OnInit {
	store = inject(Store);
	router = inject(Router);
	route = inject(ActivatedRoute);
	testService = inject(TestService);
	testRecordService = inject(TestRecordsService);
	techRecordService = inject(TechnicalRecordService);
	globalErrorService = inject(GlobalErrorService);
	globalWarningService = inject(GlobalWarningService);
	resultOfTestService = inject(ResultOfTestService);
	titleService = inject(Title);
	actions$ = inject(Actions);

	form = this.testService.form;

	initialMode = input.required<Modes>();
	mode = linkedSignal(() => this.initialMode());

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = this.store.selectSignal(techRecord);
	testResultInEdit = this.store.selectSignal(testResultInEdit);
	testResultInView = this.store.selectSignal(selectedTestResultState);
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	testTypeId = this.store.selectSignal(selectQueryParam('testType')) as Signal<string>;
	testType = computed(() => this.store.selectSignal(selectTestType(this.testTypeId()))());

	private handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			if (this.mode() === Modes.EDIT || this.mode() === Modes.AMEND) {
				this.testRecordService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
			}
		});

		this.actions$.pipe(ofType(updateTestResultSuccess), takeUntil(this.destroy$)).subscribe((action) => {
			// Navigate to test record page
			const testResult = action.payload.changes;
			this.router.navigate([
				'tech-records',
				testResult.systemNumber,
				testResult.createdAt,
				'test-records',
				'test-result',
				testResult.testResultId,
				testResult.testTypes?.at(0)?.testNumber,
			]);
		});
	}

	private handleMissingTestResult(): void {
		if (this.mode() === Modes.SUMMARY || this.mode() === Modes.EDIT) {
			this.testRecordService.editingTestResult$.pipe(takeUntil(this.destroy$)).subscribe((testResult) => {
				if (!testResult) {
					this.router.navigate(['../../..'], { relativeTo: this.route.parent });
				}
			});
		}
	}

	private handleEditingTestResult(): void {
		if (this.mode() !== Modes.AMEND) return;

		const testResult = this.testResult();
		const testResultInEdit = this.testResultInEdit();
		const testTypeId = this.testTypeId();

		// Copy viewable test result into editing test result
		if (!testResultInEdit && testResult) {
			testResult.reasonForCreation = ''; // clear reason for creation when amending
			this.testRecordService.editingTestResult(testResult);
			this.form.patchValue(testResult as any);
		}

		if (testTypeId && testTypeId !== testResult?.testTypes[0].testTypeId) {
			this.testRecordService.testTypeChange(testTypeId);
		}
	}

	ngOnInit(): void {
		this.prepopulateForm();
		this.handleFormChanges();
		this.handleMissingTestResult();
		this.handleEditingTestResult();
	}

	ngOnDestroy(): void {
		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	prepopulateForm(): void {
		const testResult = this.testResult();
		if (!testResult) return;

		this.form.markAsPristine();
		this.form.patchValue(testResult as any);

		if (this.mode() === Modes.CREATE) {
			this.form.controls.testTypes.at(0).patchValue({
				testTypeId: this.testType()?.id,
				testTypeName: this.testType()?.name,
				name: this.testType()?.name,
			});
		}
	}

	isTestTypeAbandonable(): boolean {
		const testTypeId = this.testTypeId();
		if (!testTypeId) return false;

		// You cannot abanadon a test that is desk-based or LEC
		return ![...TEST_TYPES_ALL_DESK_BASED_TESTS, ...TEST_TYPES_GROUP15_16].includes(testTypeId);
	}

	handleFormInvalid(): void {
		const errors = this.globalErrorService.extractGlobalErrors(this.form);
		this.globalErrorService.setErrors(errors);
	}

	onReview(): void {
		this.form.markAllAsTouched();

		if (this.form.valid) {
			this.mode.set(Modes.SUMMARY);
			this.setProvisionalWarning();
			return;
		}

		this.handleFormInvalid();
	}

	onCancel(mode: Modes): void {
		this.titleService.setTitle('Test details - Vehicle Testing Management');
		this.globalWarningService.clearWarnings();
		this.mode.set(mode);
	}

	private setProvisionalWarning(): void {
		if (
			this.techRecord()?.techRecord_statusCode === StatusCodes.PROVISIONAL &&
			this.validateUpdateStatus(
				this.form.getRawValue().testTypes?.[0]?.testResult as TestResults | null,
				this.testTypeId()
			)
		) {
			const warnings: GlobalWarning[] = [
				{
					warning:
						'This test will update the tech record to current, if the page is showing as provisional then refresh the page',
				},
			];
			this.globalWarningService.setWarnings(warnings);
		}
	}

	private validateUpdateStatus(testResult: TestResults | null, testTypeId: string): boolean {
		return (
			(testResult === TestResults.PASS || testResult === TestResults.PRS) &&
			(this.isTestTypeFirstTest(testTypeId) ||
				this.isTestTypeNotifiableAlteration(testTypeId) ||
				this.isTestTypeCOIF(testTypeId) ||
				this.isTestTypeIVA(testTypeId))
		);
	}

	private isTestTypeFirstTest(testTypeId: string): boolean {
		const firstTestIds = ['41', '95', '65', '66', '67', '103', '104', '82', '83', '119', '120'];
		return firstTestIds.includes(testTypeId);
	}

	private isTestTypeNotifiableAlteration(testTypeId: string): boolean {
		const notifiableAlterationIds = ['38', '47', '48'];
		return notifiableAlterationIds.includes(testTypeId);
	}

	private isTestTypeCOIF(testTypeId: string): boolean {
		const coifIds = ['142', '143', '175', '176'];
		return coifIds.includes(testTypeId);
	}

	private isTestTypeIVA(testTypeId: string): boolean {
		const ivaIds = [
			'133',
			'134',
			'138',
			'139',
			'140',
			'165',
			'169',
			'167',
			'170',
			'135',
			'172',
			'173',
			'439',
			'449',
			'136',
			'187',
			'126',
			'186',
			'193',
			'192',
			'195',
			'162',
			'191',
			'128',
			'188',
			'189',
			'125',
			'161',
			'158',
			'159',
			'154',
			'190',
			'129',
			'196',
			'194',
			'197',
			'185',
			'420',
			'438',
			'163',
			'153',
			'184',
			'130',
			'183',
		];
		return ivaIds.includes(testTypeId);
	}

	onSubmit(): void {
		// Spread to remove undefined keys
		if (this.initialMode() === Modes.EDIT) {
			const raw = { ...this.testResult() } as TestResultSchema;
			const value = cleanTestResultPayload(raw);
			if (!value) return;

			this.store.dispatch(createTestResult({ value }));
		} else {
			this.testRecordService.cleanTestResult();

			const testResultClone = { ...this.testResult() } as TestResultSchema;
			const defects = testResultClone.testTypes[0].defects;
			if (Array.isArray(defects) && defects.length > 0) {
				for (const defect of defects) {
					if (!defect.media) {
						defect.media = [{ type: 'failReason', path: ' ', reason: 'Contingency test' }];
					}
				}
			}

			this.testRecordService.updateTestResult(testResultClone);
		}
	}

	onMarkAsAbandoned(): void {
		this.form.markAllAsTouched();

		if (this.form.valid) {
			this.titleService.setTitle('Test abandoned reason - Vehicle Testing Management');
			// Mark as pristine and untouched to prevent abandon field validation showing immediately
			this.form.markAsPristine();
			this.form.markAsUntouched();
			this.mode.set(Modes.ABANDON);
			return;
		}

		this.handleFormInvalid();
	}

	onAbandon(): void {
		this.form.markAllAsTouched();

		if (this.form.valid) {
			this.resultOfTestService.toggleAbandoned(TestResults.ABANDONED);
			this.onSubmit();
			return;
		}

		this.handleFormInvalid();
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get statuses(): typeof TestStatus {
		return TestStatus;
	}

	get isTestTypeGroupEditable$(): Observable<boolean> {
		return this.testRecordService.isTestTypeGroupEditable$;
	}

	protected readonly Modes = Modes;
	protected readonly VehicleTypes = VehicleTypes;
}
