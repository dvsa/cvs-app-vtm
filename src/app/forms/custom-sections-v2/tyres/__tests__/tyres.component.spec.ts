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

import { TyresComponent } from '@forms/custom-sections-v2/tyres/tyres.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

const mockReferenceDataService = {
	fetchReferenceDataByKey: jest.fn(),
	loadReferenceData: jest.fn(),
	getAll$: jest.fn().mockReturnValue(of([])),
};

describe('TyresSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: TyresComponent;
	let componentRef: ComponentRef<TyresComponent>;
	let fixture: ComponentFixture<TyresComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({
			techRecord_axles: new FormControl([]),
			tyres_tyreCode: new FormControl(),
			tyres_tyreSize: new FormControl(),
			tyres_plyRating: new FormControl(),
			tyres_dataTrAxles: new FormControl(),
			tyres_fitmentCode: new FormControl(),
		});
		const mockTechRecord = { ...mockVehicleTechnicalRecord('hgv'), techRecord_axles: [] };

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, TyresComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				{ provide: ReferenceDataService, useValue: mockReferenceDataService },
			],
		}).compileComponents();

		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(TyresComponent);
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
		it('should detach all form controls from parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnDestroy();
			// should only have techRecord axles in parent form when this component is destroyed (as this is shared)
			expect(Object.keys(parent.controls)).toEqual([
				'techRecord_axles',
				'tyres_tyreCode',
				'tyres_tyreSize',
				'tyres_plyRating',
				'tyres_dataTrAxles',
				'tyres_fitmentCode',
			]);
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
});
