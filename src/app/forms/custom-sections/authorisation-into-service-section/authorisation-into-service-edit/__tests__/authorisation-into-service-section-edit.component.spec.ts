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
			const addControlsBasedOffVehicleTypeSpy = jest.spyOn(component, 'addControls');
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
			const completeSpy = jest.spyOn(component.destroy$, 'complete');
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
			const addControlSpy = jest.spyOn(component.form, 'addControl');
			const vehicleControlsSpy = jest.spyOn(component, 'trailerFields', 'get').mockReturnValue(component.trailerFields);
			component.addControls();
			expect(vehicleControlsSpy).toHaveBeenCalled();
			expect(addControlSpy).toHaveBeenCalled();
		});
	});
});
