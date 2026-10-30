import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { AuthorisationIntoServiceSectionEditComponent } from '@forms/custom-sections/authorisation-into-service-section/authorisation-into-service-edit/authorisation-into-service-section-edit.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('AuthorisationIntoServiceSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: AuthorisationIntoServiceSectionEditComponent;
	let componentRef: ComponentRef<AuthorisationIntoServiceSectionEditComponent>;
	let fixture: ComponentFixture<AuthorisationIntoServiceSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'trl'>, FormControl>>>({});
		const mockTechRecord = mockVehicleTechnicalRecord('trl');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AuthorisationIntoServiceSectionEditComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();

		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(AuthorisationIntoServiceSectionEditComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should call addControls', () => {
			const addControlsBasedOffVehicleTypeSpy = vi.spyOn(component, 'addControls');
			component.ngOnInit();
			expect(addControlsBasedOffVehicleTypeSpy).toHaveBeenCalled();
		});

		it('should attach all form controls to parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnInit();
			expect(parent.controls).toEqual(component.form.controls);
		});
	});

	describe('ngOnDestroy', () => {
		it('should detach all form controls from parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnDestroy();
			expect(Object.keys(parent.controls)).toEqual([]);
		});

		it('should complete destroy$ subject', () => {
			const completeSpy = vi.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(completeSpy).toHaveBeenCalled();
		});

		it('should emit true to destroy$ subject', () => {
			let emittedValue: boolean | undefined;
			component.destroy$.subscribe((value) => (emittedValue = value));
			component.ngOnDestroy();
			expect(emittedValue).toBe(true);
		});
	});

	describe('addControls', () => {
		it('should add vehicle specific controls to the form', () => {
			const addControlSpy = vi.spyOn(component.form, 'addControl');
			const vehicleControlsSpy = vi.spyOn(component, 'trailerFields', 'get').mockReturnValue(component.trailerFields);
			component.addControls();
			expect(vehicleControlsSpy).toHaveBeenCalled();
			expect(addControlSpy).toHaveBeenCalled();
		});
	});

	describe('trailerFields', () => {
		it('should return a control for each authorisation into service date field', () => {
			const fields = component.trailerFields;
			expect(Object.keys(fields)).toEqual([
				'techRecord_authIntoService_cocIssueDate',
				'techRecord_authIntoService_dateReceived',
				'techRecord_authIntoService_datePending',
				'techRecord_authIntoService_dateAuthorised',
				'techRecord_authIntoService_dateRejected',
			]);
		});

		it('should default every control to null', () => {
			const fields = component.trailerFields;
			for (const control of Object.values(fields)) {
				expect(control?.value).toBeNull();
			}
		});
	});

	describe('date validators', () => {
		it.each([
			'techRecord_authIntoService_cocIssueDate',
			'techRecord_authIntoService_dateReceived',
			'techRecord_authIntoService_dateAuthorised',
		])('should mark %s invalid when the date is in the future', (controlName) => {
			const control = component.form.controls[controlName];
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 1);
			control.setValue(futureDate.toISOString().split('T')[0]);

			expect(control.hasError('pastDate')).toBe(true);
		});

		it.each([
			'techRecord_authIntoService_cocIssueDate',
			'techRecord_authIntoService_dateReceived',
			'techRecord_authIntoService_datePending',
			'techRecord_authIntoService_dateAuthorised',
			'techRecord_authIntoService_dateRejected',
		])('should mark %s invalid when the date is malformed', (controlName) => {
			const control = component.form.controls[controlName];
			control.setValue('not-a-date');

			expect(control.valid).toBe(false);
		});

		it.each([
			'techRecord_authIntoService_cocIssueDate',
			'techRecord_authIntoService_dateReceived',
			'techRecord_authIntoService_datePending',
			'techRecord_authIntoService_dateAuthorised',
			'techRecord_authIntoService_dateRejected',
		])('should mark %s valid for a well-formed past date', (controlName) => {
			const control = component.form.controls[controlName];
			control.setValue('2020-01-01');

			expect(control.valid).toBe(true);
		});
	});
});
