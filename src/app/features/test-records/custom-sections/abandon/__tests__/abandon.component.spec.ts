import { TestBed } from '@angular/core/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { Store } from '@ngrx/store';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { testResultInEdit } from '@store/test-records';
import { AbandonComponent } from '../abandon.component';

describe('AbandonComponent', () => {
	let selectedTestResult: ReturnType<typeof createMockTestResult> | undefined;
	let reasons: { description: string }[];
	let component: AbandonComponent;
	const optionsService = { loadOptions: vi.fn() };
	const store = {
		selectSignal: vi.fn<(selector: unknown) => () => unknown>(
			(selector) => () => (selector === testResultInEdit ? selectedTestResult : reasons)
		),
	};

	const resultFor = (testTypeId: string, vehicleType: TestResultSchema['vehicleType'] = 'hgv') =>
		createMockTestResult({
			vehicleType,
			testTypes: [createMockTestType({ testTypeId, testResult: TestResults.ABANDONED })],
		});

	beforeEach(() => {
		selectedTestResult = undefined;
		reasons = [];
		TestBed.configureTestingModule({
			imports: [AbandonComponent],
			providers: [
				{ provide: Store, useValue: store },
				{ provide: MultiOptionsService, useValue: optionsService },
			],
		});
		component = TestBed.createComponent(AbandonComponent).componentInstance;
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
		selectedTestResult = resultFor('1');
		reasons = [{ description: 'Unsafe to continue' }, { description: 'Customer request' }];

		component.loadOptions();

		expect(optionsService.loadOptions).toHaveBeenCalledOnce();
		expect(component.getAbandonReasonsList()).toEqual([
			{ label: 'Unsafe to continue', value: 'Unsafe to continue' },
			{ label: 'Customer request', value: 'Customer request' },
		]);
	});

	it('keeps ADR test notes optional in form validation', () => {
		selectedTestResult = resultFor('59');

		component.ngOnInit();

		expect(component.notesRequired()).toBe(true);
		expect(component.abandonNotesLabel()).toBe('Additional notes as to why this test was abandoned');
		const notes = component.form.controls.testTypes.at(0).controls.additionalCommentsForAbandon;
		expect(notes.validator?.(notes)).toBeNull();
	});

	it('keeps ordinary-test notes optional while requiring an abandonment reason', () => {
		selectedTestResult = resultFor('1');

		component.ngOnInit();

		expect(component.notesRequired()).toBe(false);
		expect(component.abandonNotesLabel()).toBe('Additional notes as to why this test was abandoned (optional)');
		const testType = component.form.controls.testTypes.at(0);
		expect(testType.controls.reasonForAbandoning.validator?.(testType.controls.reasonForAbandoning)).toHaveProperty(
			'required'
		);
		expect(
			testType.controls.additionalCommentsForAbandon.validator?.(testType.controls.additionalCommentsForAbandon)
		).toBeNull();
	});

	it('removes temporary validators when leaving the abandonment flow', () => {
		selectedTestResult = resultFor('125');
		component.ngOnInit();
		const testType = component.form.controls.testTypes.at(0);

		component.ngOnDestroy();

		expect(testType.controls.reasonForAbandoning.validator).toBeNull();
		expect(testType.controls.additionalCommentsForAbandon.validator).toBeNull();
	});
});
