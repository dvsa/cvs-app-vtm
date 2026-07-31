import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalError } from '@/src/app/core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { GlobalWarning } from '@/src/app/core/components/global-warning/global-warning.interface';
import { GlobalWarningService } from '@/src/app/core/components/global-warning/global-warning.service';
import { ResultOfTestService } from '@/src/app/services/result-of-test/result-of-test.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
import { TestService } from '@/src/app/services/test/test.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { selectQueryParam, selectRouteNestedParams } from '@/src/app/store/router/router.selectors';
import { techRecord } from '@/src/app/store/technical-records';
import {
	cleanTestResultPayload,
	selectedTestResultState,
	testResultInEdit,
	toEditOrNotToEdit,
} from '@/src/app/store/test-records';
import { selectTestType } from '@/src/app/store/test-types/test-types.selectors';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DOCUMENT,
	OnDestroy,
	OnInit,
	Signal,
	computed,
	inject,
	input,
	linkedSignal,
} from '@angular/core';
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
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, ReplaySubject, debounceTime, takeUntil } from 'rxjs';
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	document = inject(DOCUMENT);
	userService = inject(UserService);
	testTypeService = inject(TestTypeService);

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
	routeParams = this.store.selectSignal(selectRouteNestedParams);
	testNumber = computed(() => this.routeParams()['testNumber']);

	private handleFormChanges(): void {
		// Debounce the live store mirror so rapid typing does not push a new editing test result
		// (and re-render every section) on every keystroke. Explicit actions flush synchronously.
		this.form.valueChanges.pipe(debounceTime(100), takeUntil(this.destroy$)).subscribe(() => {
			if (this.mode() === Modes.EDIT || this.mode() === Modes.AMEND) {
				this.flushFormToStore();
			}
		});
	}

	/** Immediately mirror the form into the store editing test result (flushes any pending debounced change). */
	private flushFormToStore(): void {
		this.testRecordService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
	}

	private handleMissingTestResult(): void {
		if (this.mode() === Modes.SUMMARY || this.mode() === Modes.EDIT) {
			this.testRecordService.editingTestResult$.pipe(takeUntil(this.destroy$)).subscribe((testResult) => {
				if (!testResult && !this.router.currentNavigation()) {
					this.router.navigate(['../../..'], { relativeTo: this.route.parent });
				}
			});
		}
	}

	private loadEditingTestResult(): void {
		if (!(this.mode() === Modes.AMEND || this.mode() === Modes.VIEW)) return;

		const testResult = this.testResult();
		const testResultInEdit = this.testResultInEdit();
		const testTypeId = this.testTypeId();

		// Copy viewable test result into editing test result
		if (!testResultInEdit && testResult) {
			if (this.mode() === Modes.AMEND) {
				testResult.reasonForCreation = ''; // clear reason for creation when amending.
			}
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
		this.loadEditingTestResult();
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

	private setGlobalErrors(errors: GlobalError[]): void {
		errors.sort((a, b) => {
			const elA = a.anchorLink ? this.document.getElementById(a.anchorLink) : null;
			const elB = b.anchorLink ? this.document.getElementById(b.anchorLink) : null;

			if (!elA && !elB) return 0;
			if (!elA) return 1;
			if (!elB) return -1;

			const position = elA.compareDocumentPosition(elB);

			if (TestRecordV2Component.hasDocumentPosition(position, Node.DOCUMENT_POSITION_FOLLOWING)) return -1;
			if (TestRecordV2Component.hasDocumentPosition(position, Node.DOCUMENT_POSITION_PRECEDING)) return 1;

			return 0;
		});

		this.globalErrorService.setErrors(errors);
	}

	private static hasDocumentPosition(position: number, flag: number): boolean {
		// the single `&` is a bitwise operator for comparing values
		return (position & flag) !== 0;
	}

	onReview(): void {
		this.form.markAllAsTouched();
		this.flushFormToStore(); // ensure the store has the latest form value before the summary view reads it

		const errors = this.globalErrorService.extractGlobalErrors(this.form);

		if (errors.length === 0) {
			this.mode.set(Modes.SUMMARY);
			this.setProvisionalWarning();
			return;
		}

		this.setGlobalErrors(errors);
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
			(this.testTypeService.isTestTypeFirstTest(testTypeId) ||
				this.testTypeService.isTestTypeNotifiableAlteration(testTypeId) ||
				this.testTypeService.isTestTypeCOIF(testTypeId) ||
				this.testTypeService.isTestTypeIVA(testTypeId))
		);
	}

	onSubmit(): void {
		if (this.initialMode() === Modes.EDIT) {
			return this.createTestResult();
		}

		this.amendTestResult();
	}

	createTestResult(): void {
		const value = cleanTestResultPayload({ ...this.testResult() } as TestResultSchema);
		if (!value) return;

		this.testRecordService.createTestResult(value);
	}

	amendTestResult(): void {
		const testResult = this.testResult();

		const value = cleanTestResultPayload({
			...testResult,
			contingencyTestNumber: testResult?.contingencyTestNumber || undefined,
			lastUpdatedByName: this.userService.user().name,
			lastUpdatedByEmailAddress: this.userService.userEmail(),
			lastUpdatedById: this.userService.user().oid,
			lastUpdatedAt: new Date().toISOString(),
		} as TestResultSchema);

		if (!value) return;

		this.populateDefectMedia(value);
		this.testRecordService.updateTestResult(value);
	}

	populateDefectMedia(testResult: TestResultSchema): void {
		const defects = testResult.testTypes[0].defects;
		if (Array.isArray(defects) && defects.length > 0) {
			for (const defect of defects) {
				if (!defect.media) {
					defect.media = [{ type: 'failReason', path: ' ', reason: 'Contingency test' }];
				}
			}
		}
	}

	onMarkAsAbandoned(): void {
		this.form.markAllAsTouched();
		this.flushFormToStore(); // capture any pending debounced change before leaving edit mode

		const errors = this.globalErrorService.extractGlobalErrors(this.form);

		if (errors.length === 0) {
			this.titleService.setTitle('Test abandoned reason - Vehicle Testing Management');
			this.form.markAsPristine();
			this.form.markAsUntouched();
			this.mode.set(Modes.ABANDON);
			return;
		}

		this.setGlobalErrors(errors);
	}

	onAbandon(): void {
		this.form.markAllAsTouched();

		const errors = this.globalErrorService.extractGlobalErrors(this.form);

		if (errors.length === 0) {
			this.resultOfTestService.toggleAbandoned(TestResults.ABANDONED);
			this.onSubmit();
			return;
		}

		this.setGlobalErrors(errors);
	}

	onConfirmCancel() {
		this.router.navigate(['../..'], { relativeTo: this.route.parent });
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
