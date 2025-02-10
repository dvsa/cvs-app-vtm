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
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { WeightsSectionEditComponent } from '../weights-section-edit/weights-section-edit.component';

describe('weightsSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: WeightsSectionEditComponent;
	let componentRef: ComponentRef<WeightsSectionEditComponent>;
	let fixture: ComponentFixture<WeightsSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl'>, FormControl>>>(
			{}
		);
		const mockTechRecord = mockVehicleTechnicalRecord('psv');

		await TestBed.configureTestingModule({
			declarations: [WeightsSectionEditComponent],
			imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
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
	});

	describe('ngOnInit', () => {
		it('should call addControlsBasedOffVehicleType', () => {
			const addControlsBasedOffVehicleTypeSpy = jest.spyOn(component, 'addControlsBasedOffVehicleType');
			component.ngOnInit();
			expect(addControlsBasedOffVehicleTypeSpy).toHaveBeenCalled();
		});

		it('should call prepopulateAxles', () => {
			const prepopulateAxlesSpy = jest.spyOn(component, 'prepopulateAxles');
			component.ngOnInit();
			expect(prepopulateAxlesSpy).toHaveBeenCalled();
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
			expect(Object.keys(parent.controls)).toHaveLength(0);
		});

		it('should clear all subscriptions', () => {
			const nextSpy = jest.spyOn(component.destroy$, 'next');
			const completeSpy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(nextSpy).toHaveBeenCalledWith(true);
			expect(completeSpy).toHaveBeenCalled();
		});
	});

	describe('ngOnChanges', () => {
		it('should fire required methods when ngOnChanges is run', () => {
			const axleAddedSpy = jest.spyOn(component, 'checkAxleAdded');
			const axleRemovedSpy = jest.spyOn(component, 'checkAxleRemoved');
			const ladenWeightSpy = jest.spyOn(component, 'checkGrossLadenWeightChanged');

			component.ngOnChanges({});

			expect(axleAddedSpy).toHaveBeenCalled();
			expect(axleRemovedSpy).toHaveBeenCalled();
			expect(ladenWeightSpy).toHaveBeenCalled();
		});
	});

	describe('techRecordAxles', () => {
		it('should return FormArray when techRecord_axles control exists', () => {
			component.form.addControl('techRecord_axles', new FormArray([]));
			expect(component.techRecordAxles).toBeInstanceOf(FormArray);
		});

		it('should return null when techRecord_axles control does not exist', () => {
			component.form.removeControl('techRecord_axles');
			expect(component.techRecordAxles).toBeNull();
		});
	});
});
