import { Modes } from '@/src/app/models/modes.enum';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { Store } from '@ngrx/store';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { techRecord } from '@store/technical-records';
import { isTestTypeOldIvaOrMsva, selectAllTestResults, testResultInEdit, toEditOrNotToEdit } from '@store/test-records';
import { AbandonComponent } from '../abandon.component';

describe('AbandonComponent', () => {
	const selectedTestResult = signal<ReturnType<typeof createMockTestResult> | undefined>(undefined);
	let reasons: { description: string }[];
	let component: AbandonComponent;
	const optionsService = { loadOptions: vi.fn() };
	const store = {
		selectSignal: vi.fn<(selector: unknown) => () => unknown>((selector) => {
			if (selector === testResultInEdit || selector === toEditOrNotToEdit) return selectedTestResult;
			if (selector === techRecord) return () => undefined;
			if (selector === isTestTypeOldIvaOrMsva) return () => false;
			if (selector === selectAllTestResults) return () => [];
			return () => reasons;
		}),
	};

	const resultFor = (testTypeId: string, vehicleType: TestResultSchema['vehicleType'] = 'hgv') =>
		createMockTestResult({
			vehicleType,
			testTypes: [createMockTestType({ testTypeId, testResult: TestResults.ABANDONED })],
		});

	beforeEach(() => {
		selectedTestResult.set(undefined);
		reasons = [];
		TestBed.configureTestingModule({
			imports: [AbandonComponent],
			providers: [
				{ provide: Store, useValue: store },
				{ provide: MultiOptionsService, useValue: optionsService },
			],
		});
		component = TestBed.createComponent(AbandonComponent).componentInstance;
		component.testService.mode.set(Modes.ABANDON);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns no reasons and does not load options when there is no test in edit', () => {
		expect(component.getAbandonReasonsList()).toEqual([]);
		component.loadOptions();
		expect(optionsService.loadOptions).not.toHaveBeenCalled();
	});

	it('loads vehicle-specific options and maps reference descriptions to labels and values', () => {
		selectedTestResult.set(resultFor('1'));
		reasons = [{ description: 'Unsafe to continue' }, { description: 'Customer request' }];

		component.loadOptions();

		expect(optionsService.loadOptions).toHaveBeenCalledOnce();
		expect(component.getAbandonReasonsList()).toEqual([
			{ label: 'Unsafe to continue', value: 'Unsafe to continue' },
			{ label: 'Customer request', value: 'Customer request' },
		]);
	});

	it('keeps ADR test notes optional in form validation', () => {
		selectedTestResult.set(resultFor('59'));

		component.ngOnInit();

		expect(component.notesRequired()).toBe(true);
		expect(component.abandonNotesLabel()).toBe('Additional notes as to why this test was abandoned');
		expect(component.form.testTypes[0].additionalCommentsForAbandon().errors()).toEqual([]);
	});

	it('keeps ordinary-test notes optional while requiring an abandonment reason', () => {
		selectedTestResult.set(resultFor('1'));

		component.ngOnInit();

		expect(component.notesRequired()).toBe(false);
		expect(component.abandonNotesLabel()).toBe('Additional notes as to why this test was abandoned (optional)');
		const testType = component.form.testTypes[0];
		expect(
			testType
				.reasonForAbandoning()
				.errors()
				.map((error) => error.kind)
		).toEqual(['required']);
		expect(testType.additionalCommentsForAbandon().errors()).toEqual([]);
	});

	it('drops abandonment-only rules when leaving the abandonment flow', () => {
		selectedTestResult.set(resultFor('125'));
		component.ngOnInit();
		const testType = component.form.testTypes[0];

		expect(
			testType
				.reasonForAbandoning()
				.errors()
				.map((error) => error.kind)
		).toEqual(['required']);
		expect(
			testType
				.additionalCommentsForAbandon()
				.errors()
				.map((error) => error.kind)
		).toEqual(['required']);
		component.testService.mode.set(Modes.EDIT);

		expect(testType.reasonForAbandoning().errors()).toEqual([]);
		expect(testType.additionalCommentsForAbandon().errors()).toEqual([]);
	});

	it('requires at least one reason when entering the abandonment flow', () => {
		selectedTestResult.set(resultFor('1'));
		component.testService.mode.set(Modes.EDIT);
		const reason = component.form.testTypes[0].reasonForAbandoning;
		reason().value.set([]);
		expect(reason().errors()).toEqual([]);

		component.testService.mode.set(Modes.ABANDON);
		expect(
			reason()
				.errors()
				.map((error) => error.kind)
		).toEqual(['required']);
		reason().value.set(['Unsafe to continue']);
		expect(reason().errors()).toEqual([]);
	});
});
