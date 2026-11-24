import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReasonForCreationComponent } from '../reason-for-creation.component';

describe('ReasonForCreationComponent', () => {
	let fixture: ComponentFixture<ReasonForCreationComponent>;
	let component: ReasonForCreationComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReasonForCreationComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		fixture = TestBed.createComponent(ReasonForCreationComponent);
		component = fixture.componentInstance;
		component.testService.initialMode.set(Modes.EDIT);
		component.testService.mode.set(Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('shows required errors inline and in the summary, then clears them when the field is filled', () => {
		const control = TestBed.inject(TestService).form.reasonForCreation;
		control().markAsTouched();
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('#reasonForCreation-error').textContent).toContain(
			'Reason for creation is required'
		);
		expect(TestBed.inject(GlobalErrorService).extractSignalFormErrors(component.form)).toContainEqual({
			error: 'Reason for creation is required',
			anchorLink: 'reasonForCreation',
		});

		const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = 'Contingency test';
		textarea.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(control().value()).toBe('Contingency test');
		expect(control().errors()).toEqual([]);
		expect(fixture.nativeElement.querySelector('#reasonForCreation-error')).toBeNull();
	});

	it('reports the maximum length at 101 characters but accepts 100', () => {
		const control = component.testService.form.reasonForCreation;
		control().markAsTouched();
		control().value.set('a'.repeat(101));
		fixture.detectChanges();
		const message = 'Reason for creation must be less than or equal to 100 characters';
		expect(fixture.nativeElement.querySelector('#reasonForCreation-error').textContent).toContain(message);
		expect(TestBed.inject(GlobalErrorService).extractSignalFormErrors(component.form)).toContainEqual({
			error: message,
			anchorLink: 'reasonForCreation',
		});

		control().value.set('a'.repeat(100));
		fixture.detectChanges();
		expect(control().errors()).toEqual([]);
	});

	it('only validates for edit and amendment journeys, including their summary and abandon steps', () => {
		const service = component.testService;
		service.form.reasonForCreation().value.set('');
		service.initialMode.set(Modes.VIEW);
		expect(service.form.reasonForCreation().errors()).toEqual([]);

		for (const initialMode of [Modes.EDIT, Modes.AMEND]) {
			service.initialMode.set(initialMode);
			for (const mode of [initialMode, Modes.SUMMARY, Modes.ABANDON]) {
				service.mode.set(mode);
				expect(
					service.form
						.reasonForCreation()
						.errors()
						.map((error) => error.kind)
				).toEqual(['required']);
			}
		}
	});

	it('updates the parent form validity when the journey changes', () => {
		const service = component.testService;
		// Satisfy the other migrated fields, which are required in every journey.
		service.form.testStationPNumber().value.set('P12345');
		service.form.testerStaffId().value.set('staff-1');
		service.form.euVehicleCategory().value.set('m1');
		service.form.countryOfRegistration().value.set('gb');
		const testType = service.testType;
		testType.testTypeStartTimestamp().value.set('2026-01-01T09:00:00.000Z');
		testType.testTypeEndTimestamp().value.set('2026-01-01T10:00:00.000Z');
		service.form.reasonForCreation().value.set('');
		service.initialMode.set(Modes.VIEW);
		expect(service.form().valid()).toBe(true);

		service.initialMode.set(Modes.EDIT);
		expect(service.form().invalid()).toBe(true);

		service.initialMode.set(Modes.VIEW);
		expect(service.form().valid()).toBe(true);
	});
});
