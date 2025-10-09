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
import { AuthorisationIntoServiceComponent } from '@forms/custom-sections-v2/authorisation-into-service/authorisation-into-service.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('AuthorisationIntoServiceComponent', () => {
	let component: AuthorisationIntoServiceComponent;
	let componentRef: ComponentRef<AuthorisationIntoServiceComponent>;
	let fixture: ComponentFixture<AuthorisationIntoServiceComponent>;
	let formGroupDirective: FormGroupDirective;
	let controlContainer: ControlContainer;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'trl'>, FormControl>>>({});
		const mockTechRecord = mockVehicleTechnicalRecord('trl');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AuthorisationIntoServiceComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				TechnicalRecordService,
			],
		}).compileComponents();

		controlContainer = TestBed.inject(ControlContainer);
		fixture = TestBed.createComponent(AuthorisationIntoServiceComponent);
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
});
