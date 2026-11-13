import featureConfig from '@/src/assets/featureToggle.json';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { Modes } from '@models/modes.enum';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureFlags } from '@store/feature-flags/feature-flags.feature';
import { selectFeatureFlags } from '@store/feature-flags/feature-flags.selectors';
import { initialAppState } from '@store/index';
import { toEditOrNotToEdit } from '@store/test-records';
import { TestResultSummaryWrapperComponent } from './test-result-summary-wrapper.component';

@Component({ selector: 'app-test-record-v2', template: '' })
class TestRecordV2StubComponent {
	readonly initialMode = input<Modes>();
}

@Component({ selector: 'app-test-result-summary', template: '' })
class TestResultSummaryStubComponent {}

describe('TestResultSummaryWrapperComponent', () => {
	let fixture: ComponentFixture<TestResultSummaryWrapperComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestResultSummaryWrapperComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		})
			.overrideComponent(TestResultSummaryWrapperComponent, {
				set: { imports: [TestRecordV2StubComponent, TestResultSummaryStubComponent] },
			})
			.compileComponents();
		store = TestBed.inject(MockStore);
		store.overrideSelector(
			toEditOrNotToEdit,
			createMockTestResult({ testTypes: [createMockTestType({ testTypeId: '56' })] })
		);
	});

	it('switches the summary with the configured group, independently of the old amend flag', () => {
		const refactor = featureConfig['test-result-refactor'];
		const selector = store.overrideSelector(selectFeatureFlags, {
			[FeatureFlags.TEST_RESULT_AMEND]: { enabled: false },
			[FeatureFlags.TEST_RESULT_REFACTOR]: { ...refactor, testTypesGroup5And13: true },
		});
		fixture = TestBed.createComponent(TestResultSummaryWrapperComponent);
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('app-test-record-v2')).toBeTruthy();
		expect(fixture.nativeElement.querySelector('app-test-result-summary')).toBeFalsy();

		selector.setResult({
			[FeatureFlags.TEST_RESULT_AMEND]: { enabled: true },
			[FeatureFlags.TEST_RESULT_REFACTOR]: { ...refactor, testTypesGroup5And13: false },
		});
		store.refreshState();
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('app-test-record-v2')).toBeFalsy();
		expect(fixture.nativeElement.querySelector('app-test-result-summary')).toBeTruthy();
	});
});
