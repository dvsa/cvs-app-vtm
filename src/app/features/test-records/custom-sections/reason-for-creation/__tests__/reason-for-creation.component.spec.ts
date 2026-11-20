import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { ReasonForCreationComponent } from '../reason-for-creation.component';

describe('ReasonForCreationComponent', () => {
	let fixture: ComponentFixture<ReasonForCreationComponent>;
	let component: ReasonForCreationComponent;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [ReasonForCreationComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideMockStore({ initialState: initialAppState }),
			],
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
		const control = TestBed.inject(TestService).reasonForCreation;
		control.markAsTouched();
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('#reasonForCreation-error').textContent).toContain(
			'Reason for creation is required'
		);
		expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(component.form)).toContainEqual({
			error: 'Reason for creation is required',
			anchorLink: 'reasonForCreation',
			accordion: undefined,
		});

		const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
		textarea.value = 'Contingency test';
		textarea.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(control.value).toBe('Contingency test');
		expect(control.errors).toBeNull();
		expect(fixture.nativeElement.querySelector('#reasonForCreation-error')).toBeNull();
	});

	it('reports the maximum length at 101 characters but accepts 100', () => {
		const control = component.testService.reasonForCreation;
		control.markAsTouched();
		control.setValue('a'.repeat(101));
		fixture.detectChanges();
		const message = 'Reason for creation must be less than or equal to 100 characters';
		expect(fixture.nativeElement.querySelector('#reasonForCreation-error').textContent).toContain(message);
		expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(component.form)).toContainEqual({
			error: message,
			anchorLink: 'reasonForCreation',
			accordion: undefined,
		});

		control.setValue('a'.repeat(100));
		fixture.detectChanges();
		expect(control.errors).toBeNull();
	});

	it('only validates for edit and amendment journeys, including their summary and abandon steps', () => {
		const service = component.testService;
		service.reasonForCreation.setValue('');
		service.initialMode.set(Modes.VIEW);
		expect(service.reasonForCreation.errors).toBeNull();

		for (const initialMode of [Modes.EDIT, Modes.AMEND]) {
			service.initialMode.set(initialMode);
			for (const mode of [initialMode, Modes.SUMMARY, Modes.ABANDON]) {
				service.mode.set(mode);
				expect(service.reasonForCreation.errors?.['required']).toBeTruthy();
			}
		}
	});

	it('updates the parent form validity when the journey changes', () => {
		const service = component.testService;
		service.reasonForCreation.setValue('');
		service.initialMode.set(Modes.VIEW);
		TestBed.tick();
		expect(service.form.valid).toBe(true);

		service.initialMode.set(Modes.EDIT);
		TestBed.tick();
		expect(service.form.invalid).toBe(true);

		service.initialMode.set(Modes.VIEW);
		TestBed.tick();
		expect(service.form.valid).toBe(true);
	});
});
