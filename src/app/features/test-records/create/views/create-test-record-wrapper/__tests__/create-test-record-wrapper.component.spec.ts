import featureConfig from '@/src/assets/featureToggle.json';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modes } from '@models/modes.enum';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureFlags } from '@store/feature-flags/feature-flags.feature';
import { selectFeatureFlags } from '@store/feature-flags/feature-flags.selectors';
import { initialAppState } from '@store/index';
import { selectQueryParams } from '@store/router/router.selectors';
import { CreateTestRecordWrapperComponent } from '../create-test-record-wrapper.component';

@Component({ selector: 'app-test-record-v2', template: '' })
class TestRecordV2StubComponent {
	readonly initialMode = input<Modes>();
}

@Component({ selector: 'app-create-test-record', template: '' })
class TestRecordV1StubComponent {}

describe('CreateTestRecordWrapperComponent', () => {
	let fixture: ComponentFixture<CreateTestRecordWrapperComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CreateTestRecordWrapperComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		})
			.overrideComponent(CreateTestRecordWrapperComponent, {
				set: { imports: [TestRecordV1StubComponent, TestRecordV2StubComponent] },
			})
			.compileComponents();
		store = TestBed.inject(MockStore);
		store.overrideSelector(selectQueryParams, { testType: '56' });
	});

	it.each([true, false])('renders the appropriate create form when the test type group is enabled=%s', (enabled) => {
		store.overrideSelector(selectFeatureFlags, {
			[FeatureFlags.TEST_RESULT_REFACTOR]: { ...featureConfig['test-result-refactor'], testTypesGroup5And13: enabled },
		});
		fixture = TestBed.createComponent(CreateTestRecordWrapperComponent);
		fixture.detectChanges();

		expect(!!fixture.nativeElement.querySelector('app-test-record-v2')).toBe(enabled);
		expect(!!fixture.nativeElement.querySelector('app-create-test-record')).toBe(!enabled);
	});
});
