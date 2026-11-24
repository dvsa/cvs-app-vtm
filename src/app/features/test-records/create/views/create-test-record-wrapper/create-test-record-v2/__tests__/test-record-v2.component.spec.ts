import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { GlobalWarningService } from '@/src/app/core/components/global-warning/global-warning.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { patchEditingTestResult, selectRecallsState, toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Modes } from '@models/modes.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { TestService } from '@services/test/test.service';
import { EMPTY, Observable, ReplaySubject } from 'rxjs';
import { TestRecordV2Component } from '../test-record-v2.component';

const MockUserService = {
	roles$: EMPTY,
	getUserName$: vi.fn().mockReturnValue(new Observable()),
};

describe('TestRecordV2Component', () => {
	let fixture: ComponentFixture<TestRecordV2Component>;
	let component: TestRecordV2Component;
	let store: MockStore;
	let globalWarningService: GlobalWarningService;
	let actions$: ReplaySubject<Action>;
	let testRecordsService: TestRecordsService;
	let testService: TestService;

	beforeEach(async () => {
		actions$ = new ReplaySubject(1);

		await TestBed.configureTestingModule({
			imports: [TestRecordV2Component],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideRouter([]),
				{ provide: Actions, useValue: actions$ },
				{ provide: UserService, useValue: MockUserService },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		globalWarningService = TestBed.inject(GlobalWarningService);
		testRecordsService = TestBed.inject(TestRecordsService);
		testService = TestBed.inject(TestService);
		testService.isAbandoning.set(false);
		testService.initialMode.set(Modes.EDIT);
		testService.mode.set(Modes.EDIT);
		fixture = TestBed.createComponent(TestRecordV2Component);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialise the selected test type when the create page opens', () => {
		testService.initialMode.set(Modes.EDIT);
		vi.spyOn(component as never, 'testTypeId').mockReturnValue('94');
		const selectSpy = vi.spyOn(testRecordsService, 'contingencyTestTypeSelected').mockImplementation();

		component.ngOnInit();

		expect(selectSpy).toHaveBeenCalledTimes(1);
		expect(selectSpy).toHaveBeenCalledWith('94');
	});

	it('should apply recalls prefetched by the v2 search flow when the create page opens', () => {
		const vin = '12345678901234567';
		const recalls = { hasRecall: true, manufacturer: 'Ford' };
		testService.initialMode.set(Modes.EDIT);
		vi.spyOn(component as never, 'testTypeId').mockReturnValue('94');
		vi.spyOn(testRecordsService, 'contingencyTestTypeSelected').mockImplementation();
		store.overrideSelector(techRecord, { vin } as never);
		store.overrideSelector(selectRecallsState, { recalls, vin, loading: false });
		const dispatchSpy = vi.spyOn(store, 'dispatch');

		component.ngOnInit();

		expect(component.form.recalls().value()).toEqual(recalls);
		expect(dispatchSpy).toHaveBeenCalledWith(patchEditingTestResult({ testResult: { recalls } }));
	});

	describe('amending a test because the test type was incorrect', () => {
		const existingTest = {
			testResultId: 'test-result-id',
			vin: 'VIN00000001',
			testTypes: [
				{
					testTypeId: '95',
					testTypeName: 'First test',
					testNumber: 'T12345678',
					testCode: 'FFV2',
					createdAt: '2026-09-01T09:00:00.000Z',
				},
			],
		} as TestResultSchema;

		beforeEach(() => {
			testService.initialMode.set(Modes.AMEND);
			testService.mode.set(Modes.AMEND);
			vi.spyOn(component as never, 'testResult').mockReturnValue(existingTest as never);
			vi.spyOn(component as never, 'testResultInEdit').mockReturnValue(existingTest as never);
			vi.spyOn(component as never, 'testTypeId').mockReturnValue('65' as never);
			vi.spyOn(component as never, 'testType').mockReturnValue({ id: '65', name: 'Paid first test retest' } as never);
			// `testTypeIdChanged` blanks the shared form via an effect; emulate that side effect here.
			vi.spyOn(testRecordsService, 'testTypeChange').mockImplementation(() => {
				testService.resetForm();
			});
		});

		it('should keep the existing test details once the shared form has been reset', () => {
			component.ngOnInit();

			const value = testService.value();
			expect(value.vin).toBe('VIN00000001');
			expect(value.testTypes[0].testNumber).toBe('T12345678');
			expect(value.testTypes[0].testCode).toBe('FFV2');
			expect(value.testTypes[0].createdAt).toBe('2026-09-01T09:00:00.000Z');
		});

		it('should stamp the newly selected test type onto the form', () => {
			component.ngOnInit();

			const testType = testService.value().testTypes[0];
			expect(testType.testTypeId).toBe('65');
			expect(testType.testTypeName).toBe('Paid first test retest');
			expect(testType.name).toBe('Paid first test retest');
		});

		it('should mirror the restored form into the store without waiting for the debounced sync', () => {
			const updateSpy = vi.spyOn(testRecordsService, 'updateEditingTestResult');

			component.ngOnInit();

			expect(updateSpy).toHaveBeenCalledTimes(1);
			expect(updateSpy.mock.calls[0][0].testTypes[0].testTypeId).toBe('65');
			expect(updateSpy.mock.calls[0][0].vin).toBe('VIN00000001');
		});
	});

	describe('store mirror', () => {
		it.each([Modes.EDIT, Modes.AMEND])('debounces the latest form value in %s mode', (mode) => {
			vi.useFakeTimers();
			try {
				testService.mode.set(mode);
				vi.spyOn(component as never, 'testResultInEdit').mockReturnValue({ testTypes: [{}] } as never);
				const updateSpy = vi.spyOn(testRecordsService, 'updateEditingTestResult');
				fixture.detectChanges();
				TestBed.flushEffects();
				vi.advanceTimersByTime(100);
				updateSpy.mockClear();

				testService.patch({ reasonForCreation: 'First' });
				TestBed.flushEffects();
				vi.advanceTimersByTime(99);
				expect(updateSpy).not.toHaveBeenCalled();
				testService.patch({ reasonForCreation: 'Latest' });
				TestBed.flushEffects();
				vi.advanceTimersByTime(99);
				expect(updateSpy).not.toHaveBeenCalled();
				vi.advanceTimersByTime(1);
				expect(updateSpy).toHaveBeenCalledTimes(1);
				expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ reasonForCreation: 'Latest' }));
			} finally {
				vi.useRealTimers();
			}
		});

		it.each([
			[Modes.EDIT, false],
			[Modes.AMEND, false],
			[Modes.SUMMARY, true],
			[Modes.ABANDON, true],
			[Modes.VIEW, true],
		])('does not mirror in %s mode with editing result present: %s', (mode, hasEditingResult) => {
			vi.useFakeTimers();
			try {
				testService.mode.set(mode);
				vi.spyOn(component as never, 'testResultInEdit').mockReturnValue(
					(hasEditingResult ? { testTypes: [{}] } : undefined) as never
				);
				const updateSpy = vi.spyOn(testRecordsService, 'updateEditingTestResult');
				fixture.detectChanges();
				testService.patch({ reasonForCreation: 'Not mirrored' });
				TestBed.flushEffects();
				vi.advanceTimersByTime(100);
				expect(updateSpy).not.toHaveBeenCalled();
			} finally {
				vi.useRealTimers();
			}
		});
	});

	describe('onReview', () => {
		const populateReviewFields = () => {
			testService.initialMode.set(Modes.EDIT);
			testService.mode.set(Modes.EDIT);
			testService.patch({
				contingencyTestNumber: '123456',
				countryOfRegistration: 'gb',
				euVehicleCategory: 'm1',
				odometerReading: 100,
				odometerReadingUnits: 'miles',
				reasonForCreation: 'Reason for creating the test',
				testStationPNumber: 'P12345',
				testerStaffId: '12345',
				testTypes: [
					{
						testTypeStartTimestamp: '2025-01-01T10:00:00.000Z',
						testTypeEndTimestamp: '2025-01-01T10:30:00.000Z',
					},
				],
			});
		};

		it('blocks review for an empty signal reason and allows it after correction', () => {
			populateReviewFields();
			component.form.reasonForCreation().value.set('');
			const setErrors = vi.spyOn(TestBed.inject(GlobalErrorService), 'setErrors');

			component.onReview();

			expect(testService.mode()).toBe(Modes.EDIT);
			expect(setErrors).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({ error: 'Reason for creation is required', anchorLink: 'reasonForCreation' }),
				])
			);

			component.form.reasonForCreation().value.set('Reason for creating the test');
			component.onReview();
			expect(testService.mode()).toBe(Modes.SUMMARY);
		});

		it('keeps contingency number validation active when reviewing a new test', () => {
			populateReviewFields();
			component.form.contingencyTestNumber().value.set('12345');
			const setErrors = vi.spyOn(TestBed.inject(GlobalErrorService), 'setErrors');

			component.onReview();

			expect(testService.mode()).toBe(Modes.EDIT);
			expect(setErrors).toHaveBeenCalledWith(
				expect.arrayContaining([
					{
						error: 'Contingency Test Number must be greater than or equal to 6 characters',
						anchorLink: 'contingencyTestNumber',
					},
				])
			);

			component.form.contingencyTestNumber().value.set('01234567');
			component.onReview();

			expect(testService.mode()).toBe(Modes.SUMMARY);
			expect(testService.value().contingencyTestNumber).toBe('01234567');
		});

		it('should set mode to SUMMARY when form is valid', () => {
			testService.testType.testResult().value.set(TestResults.FAIL);
			const markAsTouchedSpy = vi.spyOn(component.form(), 'markAsTouched');
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			component.onReview();

			expect(markAsTouchedSpy).toHaveBeenCalled();
			expect(testService.mode()).toBe(Modes.SUMMARY);
		});

		it('should set global errors when form has validation errors', () => {
			const globalErrorService = TestBed.inject(GlobalErrorService);
			vi.spyOn(globalErrorService, 'extractSignalFormErrors').mockReturnValue([
				{ error: 'Test error', anchorLink: 'testField' },
			]);
			const setErrorsSpy = vi.spyOn(globalErrorService, 'setErrors');

			component.onReview();

			expect(setErrorsSpy).toHaveBeenCalled();
		});

		it('should set warning when tech record is provisional and test result is PASS for a first test', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.PASS);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('41');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalledWith([
				{
					warning:
						'This test will update the tech record to current, if the page is showing as provisional then refresh the page',
				},
			]);
		});

		it('should set warning when tech record is provisional and test result is PRS for a first test', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.PRS);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('95');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalledWith([
				{
					warning:
						'This test will update the tech record to current, if the page is showing as provisional then refresh the page',
				},
			]);
		});

		it('should set warning for notifiable alteration test type', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.PASS);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('38');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalled();
		});

		it('should set warning for COIF test type', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.PASS);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('142');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalled();
		});

		it('should set warning for IVA test type', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.PASS);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('133');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalled();
		});

		it('should not set warning when tech record is CURRENT', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.CURRENT } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.PASS);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('41');

			component.onReview();

			expect(setWarningsSpy).not.toHaveBeenCalled();
		});

		it('should not set warning when test result is FAIL', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.FAIL);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('41');

			component.onReview();

			expect(setWarningsSpy).not.toHaveBeenCalled();
		});

		it('should not set warning when test type does not qualify', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			testService.testType.testResult().value.set(TestResults.PASS);
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);

			const setWarningsSpy = vi.spyOn(globalWarningService, 'setWarnings');
			vi.spyOn(component as any, 'testTypeId').mockReturnValue('94');

			component.onReview();

			expect(setWarningsSpy).not.toHaveBeenCalled();
		});
	});

	describe('onReview error sorting', () => {
		it('should sort errors by DOM position regardless of form control declaration order', () => {
			const container = document.createElement('div');
			const elFirst = document.createElement('input');
			elFirst.id = 'contingencyTestNumber';
			const elSecond = document.createElement('input');
			elSecond.id = 'testStationPNumber';
			container.appendChild(elFirst);
			container.appendChild(elSecond);
			document.body.appendChild(container);

			const globalErrorService = TestBed.inject(GlobalErrorService);
			vi.spyOn(globalErrorService, 'extractSignalFormErrors').mockReturnValue([
				{ error: 'Visit error', anchorLink: 'testStationPNumber' },
				{ error: 'Test error', anchorLink: 'contingencyTestNumber' },
			]);
			const setErrorsSpy = vi.spyOn(globalErrorService, 'setErrors');

			component.onReview();

			expect(setErrorsSpy).toHaveBeenCalledWith([
				{ error: 'Test error', anchorLink: 'contingencyTestNumber' },
				{ error: 'Visit error', anchorLink: 'testStationPNumber' },
			]);

			document.body.removeChild(container);
		});

		it('should place errors with no matching DOM element at the end', () => {
			const container = document.createElement('div');
			const el = document.createElement('input');
			el.id = 'knownField';
			container.appendChild(el);
			document.body.appendChild(container);

			const globalErrorService = TestBed.inject(GlobalErrorService);
			vi.spyOn(globalErrorService, 'extractSignalFormErrors').mockReturnValue([
				{ error: 'Unknown field error', anchorLink: 'unknownField' },
				{ error: 'Known field error', anchorLink: 'knownField' },
			]);
			const setErrorsSpy = vi.spyOn(globalErrorService, 'setErrors');

			component.onReview();

			expect(setErrorsSpy).toHaveBeenCalledWith([
				{ error: 'Known field error', anchorLink: 'knownField' },
				{ error: 'Unknown field error', anchorLink: 'unknownField' },
			]);

			document.body.removeChild(container);
		});
	});

	describe('onCancel', () => {
		it('should set mode back to EDIT', () => {
			testService.initialMode.set(Modes.EDIT);
			testService.mode.set(Modes.SUMMARY);
			component.onCancel(testService.initialMode());

			expect(testService.mode()).toBe(Modes.EDIT);
		});

		it('should clear warnings', () => {
			const clearWarningsSpy = vi.spyOn(globalWarningService, 'clearWarnings');
			testService.initialMode.set(Modes.EDIT);
			component.onCancel(testService.initialMode());

			expect(clearWarningsSpy).toHaveBeenCalled();
		});

		it('should stop abandoning the test when backing out of the abandon flow', () => {
			testService.initialMode.set(Modes.EDIT);
			testService.mode.set(Modes.ABANDON);
			testService.isAbandoning.set(true);

			component.onCancel(testService.initialMode());

			expect(testService.isAbandoning()).toBe(false);
		});

		it('should clear errors', () => {
			const clearErrorsSpy = vi.spyOn(TestBed.inject(GlobalErrorService), 'clearErrors');
			testService.initialMode.set(Modes.EDIT);
			testService.mode.set(Modes.ABANDON);

			component.onCancel(testService.initialMode());

			expect(clearErrorsSpy).toHaveBeenCalled();
		});
	});

	describe('onMarkAsAbandoned', () => {
		it('should flag the test as being abandoned before validating the form', () => {
			testService.initialMode.set(Modes.EDIT);
			const globalErrorService = TestBed.inject(GlobalErrorService);
			vi.spyOn(globalErrorService, 'extractSignalFormErrors').mockImplementation(() => {
				// the sections read this flag while their validators run
				expect(testService.isAbandoning()).toBe(true);
				return [];
			});

			component.onMarkAsAbandoned();

			expect(testService.isAbandoning()).toBe(true);
			expect(testService.mode()).toBe(Modes.ABANDON);
		});

		it('should stop abandoning the test when the form is invalid', () => {
			testService.initialMode.set(Modes.EDIT);
			const globalErrorService = TestBed.inject(GlobalErrorService);
			vi.spyOn(globalErrorService, 'extractSignalFormErrors').mockReturnValue([
				{ error: 'Contingency Test Number is required', anchorLink: 'contingencyTestNumber' },
			]);

			component.onMarkAsAbandoned();

			expect(testService.isAbandoning()).toBe(false);
			expect(testService.mode()).toBe(Modes.EDIT);
		});
	});

	describe('onAbandon', () => {
		it('marks abandonment fields touched and reports a missing reason', () => {
			testService.mode.set(Modes.ABANDON);
			const setErrors = vi.spyOn(TestBed.inject(GlobalErrorService), 'setErrors');

			component.onAbandon();

			expect(testService.testType.reasonForAbandoning().touched()).toBe(true);
			expect(testService.testType.additionalCommentsForAbandon().touched()).toBe(true);
			expect(setErrors).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						error: 'Why was this test abandoned? is required',
						anchorLink: 'reasonForAbandoning',
					}),
				])
			);
		});

		it('includes the selected reason and additional comments in the submitted test result', () => {
			testService.initialMode.set(Modes.EDIT);
			let storedTestResult = testService.value() as TestResultSchema;
			vi.spyOn(component as never, 'testResult').mockImplementation(() => storedTestResult);
			vi.spyOn(testRecordsService, 'updateEditingTestResult').mockImplementation((testResult) => {
				storedTestResult = testResult;
			});
			vi.spyOn(TestBed.inject(ResultOfTestService), 'toggleAbandoned').mockImplementation((result) => {
				storedTestResult = {
					...storedTestResult,
					testTypes: [{ ...storedTestResult.testTypes[0], testResult: result }],
				};
			});
			const createSpy = vi.spyOn(testRecordsService, 'createTestResult').mockImplementation();
			vi.spyOn(TestBed.inject(GlobalErrorService), 'extractSignalFormErrors').mockReturnValue([]);
			testService.patch({
				testTypes: [
					{
						testTypeId: '95',
						reasonForAbandoning: ['Abandoned at presenter request'] as never,
						additionalCommentsForAbandon: 'Presenter could not continue the test',
					},
				],
			});

			component.onAbandon();

			expect(createSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					testTypes: [
						expect.objectContaining({
							testResult: TestResults.ABANDONED,
							reasonForAbandoning: 'Abandoned at presenter request',
							additionalCommentsForAbandon: 'Presenter could not continue the test',
						}),
					],
				})
			);
		});
	});

	describe('section visibility', () => {
		const setTestResult = (vehicleType: string, testTypeId: string) => {
			store.overrideSelector(toEditOrNotToEdit, { vehicleType, testTypes: [{ testTypeId }] } as TestResultSchema);
			store.refreshState();
		};

		it('should show seatbelts and defects for a PSV annual test', () => {
			setTestResult('psv', '1');

			expect(!testService.testType.seatbeltInstallationCheckDate().hidden()).toBe(true);
			expect(!testService.testType.defects().hidden()).toBe(true);
			expect(!testService.testType.requiredStandards().hidden()).toBe(false);
			expect(!testService.testType.customDefects().hidden()).toBe(false);
		});

		it.each(['psv', 'hgv', 'trl', 'car', 'lgv', 'motorcycle'])(
			'should show required standards and additional defects instead of seatbelts and defects for a %s IVA/MSVA test',
			(vehicleType) => {
				setTestResult(vehicleType, '130');

				expect(!testService.testType.seatbeltInstallationCheckDate().hidden()).toBe(false);
				expect(!testService.testType.defects().hidden()).toBe(false);
				expect(!testService.testType.requiredStandards().hidden()).toBe(true);
				expect(!testService.testType.customDefects().hidden()).toBe(true);
			}
		);
	});
});
