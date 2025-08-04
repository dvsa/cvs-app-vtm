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

import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { Observable, of } from 'rxjs';
import { TyresSectionEditComponent } from '../tyres-section-edit.component';

const mockReferenceDataService = {
	fetchReferenceDataByKey: jest.fn(),
	loadReferenceData: jest.fn(),
	getAll$: jest.fn().mockReturnValue(of([])),
};

describe('TyresSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: TyresSectionEditComponent;
	let componentRef: ComponentRef<TyresSectionEditComponent>;
	let fixture: ComponentFixture<TyresSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	const actions$ = new Observable<Action>();

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl'>, FormControl>>>({
			techRecord_axles: new FormControl(),
		});
		const mockTechRecord = mockVehicleTechnicalRecord('hgv');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, TyresSectionEditComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { snapshot: { data: { reason: 'test' } } } },
				TechnicalRecordService,
				{ provide: ReferenceDataService, useValue: mockReferenceDataService },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(TyresSectionEditComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach all form controls to parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnInit();
			expect(Object.keys(parent.controls)).toEqual(['techRecord_axles', 'techRecord_tyreUseCode']);
		});
	});

	describe('ngOnDestroy', () => {
		it('should detach all form controls from parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnDestroy();
			// should only have techRecord axles in parent form when this component is destroyed (as this is shared)
			expect(Object.keys(parent.controls)).toEqual(['techRecord_axles']);
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
