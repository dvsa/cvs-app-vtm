import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { GlobalWarning } from '@core/components/global-warning/global-warning.interface';
import { GlobalWarningService } from '@core/components/global-warning/global-warning.service';
import { AbandonDialogComponent } from '@forms/custom-sections/abandon-dialog/abandon-dialog.component';
import { TestModeEnum } from '@models/test-results/test-result-view.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { TEST_TYPES_ALL_DESK_BASED_TESTS, TEST_TYPES_GROUP15_16 } from '@models/testTypeId.enum';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { State } from '@store/index';
import { selectTechRecord } from '@store/technical-records';
import { createTestResultSuccess } from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { BehaviorSubject, Observable, Subject, filter, firstValueFrom, of, take, takeUntil, tap } from 'rxjs';
import { BannerComponent } from '../../../../../components/banner/banner.component';
import { ButtonGroupComponent } from '../../../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../../../components/button/button.component';
import { AbandonDialogComponent as AbandonDialogComponent_1 } from '../../../../../forms/custom-sections/abandon-dialog/abandon-dialog.component';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';

@Component({
	selector: 'app-create-test-record',
	templateUrl: './create-test-record.component.html',
	imports: [
		BannerComponent,
		ButtonComponent,
		RouterLink,
		BaseTestRecordComponent,
		ButtonGroupComponent,
		AbandonDialogComponent_1,
		AsyncPipe,
	],
})
export class CreateTestRecordComponent implements OnInit, OnDestroy, AfterViewInit {
	baseTestRecordComponent = viewChild(BaseTestRecordComponent);
	abandonDialog = viewChild(AbandonDialogComponent);

	private destroy$ = new Subject<void>();

	canCreate$ = new BehaviorSubject(false);
	testMode = TestModeEnum.Edit;
	testResult$: Observable<TestResultModel | undefined> = of(undefined);
	testTypeId?: string;
	techRecord: V3TechRecordModel | undefined = undefined;

	constructor(
		private actions$: Actions,
		private errorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router,
		private routerService: RouterService,
		private testRecordsService: TestRecordsService,
		private cdr: ChangeDetectorRef,
		private resultOfTestService: ResultOfTestService,
		private store: Store<State>,
		private warningService: GlobalWarningService
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	ngOnInit(): void {
		this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
			tap((editingTestResult) => !editingTestResult && this.backToTechRecord())
		);

		this.routerService
			.getQueryParam$('testType')
			.pipe(
				take(1),
				tap((testType) => !testType && this.backToTechRecord()),
				filter((tt) => !!tt)
			)
			.subscribe((testTypeId) => {
				this.testRecordsService.contingencyTestTypeSelected(testTypeId as string);
				// @ts-ignore
				this.testTypeId = testTypeId;
			});

		this.watchForCreateSuccess();

		this.testRecordsService.canCreate$.pipe(take(1)).subscribe((val) => this.canCreate$.next(val));

		this.store
			.select(selectTechRecord)
			.pipe(take(1))
			.subscribe((techRecord) => {
				this.techRecord = techRecord;
			});
	}

	ngOnDestroy(): void {
		this.errorService.clearErrors();

		this.destroy$.next();
		this.destroy$.complete();
	}

	ngAfterViewInit(): void {
		this.cdr.detectChanges();
	}

	backToTechRecord(): void {
		void this.router.navigate(['../../..'], { relativeTo: this.route.parent });
	}

	/**
	 * Merge all section form values into one testResult and trigger action to update testResult.
	 * @returns void
	 */
	async handleSave(): Promise<void> {
		if (this.isAnyFormInvalid()) {
			return;
		}

		this.testRecordsService.cleanTestResult();

		const testResult = await firstValueFrom(this.testResult$);
		const testResultClone = cloneDeep(testResult) as TestResultModel;

		this.testRecordsService.createTestResult(testResultClone);
	}

	async handleReview() {
		if (this.isAnyFormInvalid()) return;
		if (this.techRecord == null) return;

		this.errorService.clearErrors();
		this.testMode = TestModeEnum.View;

		const testResult = await firstValueFrom(this.testResult$);
		if (
			testResult &&
			this.techRecord?.techRecord_statusCode === StatusCodes.PROVISIONAL &&
			this.testTypeId &&
			this.validateUpdateStatus(testResult.testTypes[0].testResult, this.testTypeId)
		) {
			const warnings: GlobalWarning[] = [];
			warnings.push({
				warning:
					'This test will update the tech record to current, if the page is showing as provisional then refresh the page',
			});
			this.warningService.setWarnings(warnings);
		}
	}

	handleCancel() {
		this.testMode = TestModeEnum.Edit;
		this.warningService.clearWarnings();
	}

	watchForCreateSuccess() {
		this.actions$.pipe(ofType(createTestResultSuccess), takeUntil(this.destroy$)).subscribe(() => {
			this.backToTechRecord();
		});
	}

	handleNewTestResult(testResult: TestResultModel) {
		this.testRecordsService.updateEditingTestResult(testResult);
	}

	isAnyFormInvalid() {
		const errors: GlobalError[] = [];
		const forms = [];

		const baseTestRecordComponent = this.baseTestRecordComponent();

		const sectionsbaseTestRecordComponent = baseTestRecordComponent?.sections();
		if (sectionsbaseTestRecordComponent) {
			sectionsbaseTestRecordComponent.forEach((section) => forms.push(section.form));
		}

		const defectsbaseTestRecordComponent = baseTestRecordComponent?.defects();
		if (defectsbaseTestRecordComponent) {
			forms.push(defectsbaseTestRecordComponent.form);
		}

		const customDefectsbaseTestRecordComponent = baseTestRecordComponent?.customDefects();
		if (customDefectsbaseTestRecordComponent) {
			forms.push(customDefectsbaseTestRecordComponent.form);
		}

		const abandonDialogDynamicFormGroup = this.abandonDialog();
		const dynamicFormGroup = abandonDialogDynamicFormGroup?.dynamicFormGroup();
		if (this.testMode === TestModeEnum.Abandon && dynamicFormGroup) {
			forms.push(dynamicFormGroup.form);
		}

		forms.forEach((form) => {
			DynamicFormService.validate(form, errors);
		});

		if (errors.length) {
			this.errorService.setErrors(errors);
		}

		return forms.some((form) => form.invalid);
	}

	abandon() {
		this.resultOfTestService.toggleAbandoned(resultOfTestEnum.abandoned);

		if (this.isAnyFormInvalid()) {
			return;
		}

		this.testMode = TestModeEnum.Abandon;
	}

	async handleAbandonAction(event: string) {
		switch (event) {
			case 'yes':
				await this.handleSave();
				break;
			case 'no':
				this.abandonDialog()?.dynamicFormGroup()?.form.reset();
				this.resultOfTestService.toggleAbandoned(resultOfTestEnum.pass);
				this.testMode = TestModeEnum.Edit;
				break;
			default:
				console.error('Invalid action');
		}
	}

	get shouldShowAbandonButton(): boolean {
		const isDeskBasedOrLECTest = [...TEST_TYPES_ALL_DESK_BASED_TESTS, ...TEST_TYPES_GROUP15_16].includes(
			this.testTypeId ?? ''
		);
		return !isDeskBasedOrLECTest;
	}

	public get TestModeEnum(): typeof TestModeEnum {
		return TestModeEnum;
	}

	validateUpdateStatus = (testResult: string, testTypeId: string): boolean =>
		(testResult === 'pass' || testResult === 'prs') &&
		(this.isTestTypeFirstTest(testTypeId) ||
			this.isTestTypeNotifiableAlteration(testTypeId) ||
			this.isTestTypeCOIF(testTypeId) ||
			this.isTestTypeIVA(testTypeId));

	isTestTypeFirstTest(testTypeId: string): boolean {
		const firstTestIds = ['41', '95', '65', '66', '67', '103', '104', '82', '83', '119', '120'];
		return firstTestIds.includes(testTypeId);
	}

	isTestTypeNotifiableAlteration(testTypeId: string): boolean {
		const notifiableAlterationIds = ['38', '47', '48'];
		return notifiableAlterationIds.includes(testTypeId);
	}

	isTestTypeCOIF(testTypeId: string): boolean {
		const coifIds = ['142', '143', '175', '176'];
		return coifIds.includes(testTypeId);
	}

	isTestTypeIVA(testTypeId: string): boolean {
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
}
