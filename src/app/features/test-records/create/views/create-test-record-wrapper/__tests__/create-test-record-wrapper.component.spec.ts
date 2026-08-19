import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modes } from '@models/modes.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { initialAppState } from '@store/index';
import { CreateTestRecordWrapperComponent } from '../create-test-record-wrapper.component';

@Component({ selector: 'app-test-record-v2', template: '' })
class TestRecordV2StubComponent {
	readonly initialMode = input<Modes>();
}

@Component({ selector: 'app-create-test-record', template: '' })
class TestRecordV1StubComponent {}

describe('CreateTestRecordWrapperComponent', () => {
	let fixture: ComponentFixture<CreateTestRecordWrapperComponent>;
	const featureToggleService = { shouldUseV2TestResults: jest.fn().mockReturnValue(true) };

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CreateTestRecordWrapperComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: FeatureToggleService, useValue: featureToggleService },
			],
		})
			.overrideComponent(CreateTestRecordWrapperComponent, {
				set: { imports: [TestRecordV1StubComponent, TestRecordV2StubComponent] },
			})
			.compileComponents();
	});

	it('should render the v2 test form when the selected test type uses v2', () => {
		fixture = TestBed.createComponent(CreateTestRecordWrapperComponent);

		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('app-test-record-v2')).toBeTruthy();
		expect(fixture.nativeElement.querySelector('app-create-test-record')).toBeFalsy();
		expect(featureToggleService.shouldUseV2TestResults).toHaveBeenCalled();
	});
});
