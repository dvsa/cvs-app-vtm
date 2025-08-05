import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormArray,
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
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { Observable, of } from 'rxjs';
import { WeightsSectionEditComponent } from '../weights-section-edit/weights-section-edit.component';

describe('weightsSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: WeightsSectionEditComponent;
	let componentRef: ComponentRef<WeightsSectionEditComponent>;
	let fixture: ComponentFixture<WeightsSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	const actions$ = new Observable<Action>();

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl'>, FormControl>>>({
			techRecord_axles: new FormControl(),
		});
		const mockTechRecord = mockVehicleTechnicalRecord('psv');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, WeightsSectionEditComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideMockActions(() => actions$),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				TechnicalRecordService,
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(WeightsSectionEditComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();

		jest.spyOn(component.techRecordAxles, 'get').mockReturnValue(new FormArray([]));
	});

	describe('ngOnInit', () => {
		it('should attach all form controls to parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnInit();
			expect(Object.keys(parent.controls)).toEqual([
				'techRecord_axles',
				'techRecord_unladenWeight',
				'techRecord_grossKerbWeight',
				'techRecord_grossLadenWeight',
				'techRecord_grossGbWeight',
				'techRecord_grossDesignWeight',
				'techRecord_maxTrainGbWeight',
				'techRecord_trainDesignWeight',
			]);
		});
	});

	describe('ngOnDestroy', () => {
		it('should detach all form controls from parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnDestroy();
			// should only have techRecord axles in parent form when this component is destroyed (as this is shared)
			expect(Object.keys(parent.controls)).toEqual(['techRecord_axles']);
		});

		it('should clear all subscriptions', () => {
			const nextSpy = jest.spyOn(component.destroy$, 'next');
			const completeSpy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(nextSpy).toHaveBeenCalledWith(true);
			expect(completeSpy).toHaveBeenCalled();
		});
	});
});
