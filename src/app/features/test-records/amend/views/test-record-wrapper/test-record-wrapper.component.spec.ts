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
import { TestRecordWrapperComponent } from './test-record-wrapper.component';

@Component({ selector: 'app-test-record-v2', template: '' })
class TestRecordV2StubComponent {
	readonly initialMode = input<Modes>();
}

@Component({ selector: 'app-test-records', template: '' })
class TestRecordV1StubComponent {}

describe('TestRecordWrapperComponent', () => {
	let fixture: ComponentFixture<TestRecordWrapperComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestRecordWrapperComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		})
			.overrideComponent(TestRecordWrapperComponent, {
				set: { imports: [TestRecordV1StubComponent, TestRecordV2StubComponent] },
			})
			.compileComponents();
		store = TestBed.inject(MockStore);
		store.overrideSelector(
			toEditOrNotToEdit,
			createMockTestResult({ testTypes: [createMockTestType({ testTypeId: '56' })] })
		);
	});

	it.each([true, false])('renders the appropriate amend form when the test type group is enabled=%s', (enabled) => {
		store.overrideSelector(selectFeatureFlags, {
			[FeatureFlags.TEST_RESULT_REFACTOR]: { ...featureConfig['test-result-refactor'], testTypesGroup5And13: enabled },
		});
		fixture = TestBed.createComponent(TestRecordWrapperComponent);
		fixture.detectChanges();

		expect(!!fixture.nativeElement.querySelector('app-test-record-v2')).toBe(enabled);
		expect(!!fixture.nativeElement.querySelector('app-test-records')).toBe(!enabled);
	});
});
