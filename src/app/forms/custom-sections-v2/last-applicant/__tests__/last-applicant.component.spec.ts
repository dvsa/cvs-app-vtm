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
import { LastApplicantComponent } from '@forms/custom-sections-v2/last-applicant/last-applicant.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('LastApplicantComponent', () => {
	let store: MockStore;
	let component: LastApplicantComponent;
	let componentRef: ComponentRef<LastApplicantComponent>;
	let fixture: ComponentFixture<LastApplicantComponent>;
	let controlContainer: ControlContainer;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<
			Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'lgv' | 'trl'>, FormControl>>
		>({
			techRecord_applicantDetails_name: new FormControl(''),
			techRecord_applicantDetails_address1: new FormControl(''),
			techRecord_applicantDetails_address2: new FormControl(''),
			techRecord_applicantDetails_address3: new FormControl(''),
			techRecord_applicantDetails_postTown: new FormControl(''),
			techRecord_applicantDetails_postCode: new FormControl(''),
			techRecord_applicantDetails_telephoneNumber: new FormControl(''),
			techRecord_applicantDetails_emailAddress: new FormControl(''),
		});
		const mockTechRecord = mockVehicleTechnicalRecord('hgv');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, LastApplicantComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);
		fixture = TestBed.createComponent(LastApplicantComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const parentFormSpy = jest.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();

			expect(parentFormSpy).toHaveBeenCalled();
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from all subscriptions', () => {
			const spy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});

		it('should detach its form from its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'removeControl');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('shouldDisplayFormControl', () => {
		it('should return true if the form control exists on the form', () => {
			const formSpy = jest.spyOn(component.form, 'get');
			const returnValue = component.shouldDisplayFormControl('techRecord_applicantDetails_name');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(true);
		});

		it('should return false if the form control does not exists on the form', () => {
			const formSpy = jest.spyOn(component.form, 'get');
			const returnValue = component.shouldDisplayFormControl('techRecord_reasonForCreation');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(false);
		});
	});
});
