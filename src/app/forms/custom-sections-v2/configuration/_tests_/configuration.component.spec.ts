import { initialAppState } from '@/src/app/store';
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
import { ConfigurationComponent } from '@forms/custom-sections-v2/configuration/configuration.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

describe('ConfigurationComponent', () => {
	let component: ConfigurationComponent;
	let componentRef: ComponentRef<ConfigurationComponent>;
	let fixture: ComponentFixture<ConfigurationComponent>;
	let formGroupDirective: FormGroupDirective;
	let controlContainer: ControlContainer;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'hgv' | 'trl' | 'psv'>, FormControl>>>({
			techRecord_departmentalVehicleMarker: new FormControl(),
		});
		const mockTechRecord = mockVehicleTechnicalRecord('hgv');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, ConfigurationComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{
					provide: ActivatedRoute,
					useValue: {
						params: of([{ id: 1 }]),
						snapshot: {
							data: {
								reason: 'edit',
							},
						},
					},
				},
			],
		}).compileComponents();

		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(ConfigurationComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
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
			const returnValue = component.shouldDisplayFormControl('techRecord_departmentalVehicleMarker');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(true);
		});

		it('should return false if the form control does not exists on the form', () => {
			const formSpy = jest.spyOn(component.form, 'get');
			const returnValue = component.shouldDisplayFormControl('fake_control');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(false);
		});
	});
});
