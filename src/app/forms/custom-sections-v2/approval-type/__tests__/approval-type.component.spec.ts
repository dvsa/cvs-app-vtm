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
import { ApprovalTypeComponent } from '@forms/custom-sections-v2/approval-type/approval-type.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('ApprovalTypeComponent', () => {
	let store: MockStore;
	let component: ApprovalTypeComponent;
	let componentRef: ComponentRef<ApprovalTypeComponent>;
	let fixture: ComponentFixture<ApprovalTypeComponent>;
	let controlContainer: ControlContainer;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'hgv'>, FormControl>>>({
			techRecord_approvalType: new FormControl(''),
		});
		const mockTechRecord = mockVehicleTechnicalRecord('hgv');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, ApprovalTypeComponent],
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

		fixture = TestBed.createComponent(ApprovalTypeComponent);
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
			const returnValue = component.shouldDisplayFormControl('techRecord_approvalType');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(true);
		});

		it('should return false if the form control does not exists on the form', () => {
			const formSpy = jest.spyOn(component.form, 'get');
			const returnValue = component.shouldDisplayFormControl('techRecord_axles');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(false);
		});
	});
});
