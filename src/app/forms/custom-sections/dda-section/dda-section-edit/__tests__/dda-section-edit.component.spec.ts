import { createMockPsv } from '@/src/mocks/psv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { DDASectionEditComponent } from '../dda-section-edit.component';

describe('DDASectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: DDASectionEditComponent;
	let componentRef: ComponentRef<DDASectionEditComponent>;
	let fixture: ComponentFixture<DDASectionEditComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, DDASectionEditComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();

		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(DDASectionEditComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', createMockPsv(0) as TechRecordType<'psv'>);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should attach all form controls to the parent form', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnInit();
			expect(parent.controls).toEqual(component.form.controls);
		});
	});

	describe('ngOnDestroy', () => {
		it('should detach all form controls from the parent form', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnDestroy();
			expect(Object.keys(parent.controls)).toEqual([]);
		});

		it('should complete the destroy$ subject', () => {
			const completeSpy = vi.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(completeSpy).toHaveBeenCalled();
		});
	});

	describe('psvControls', () => {
		it('should return a control for every DDA field', () => {
			expect(Object.keys(component.psvControls)).toEqual([
				'techRecord_dda_certificateIssued',
				'techRecord_dda_wheelchairCapacity',
				'techRecord_dda_wheelchairFittings',
				'techRecord_dda_wheelchairLiftPresent',
				'techRecord_dda_wheelchairLiftInformation',
				'techRecord_dda_wheelchairRampPresent',
				'techRecord_dda_wheelchairRampInformation',
				'techRecord_dda_minEmergencyExits',
				'techRecord_dda_outswing',
				'techRecord_dda_ddaSchedules',
				'techRecord_dda_seatbeltsFitted',
				'techRecord_dda_ddaNotes',
			]);
		});

		it('should mark wheelchair capacity as invalid above the maximum', () => {
			component.form.controls.techRecord_dda_wheelchairCapacity.setValue(100);
			expect(component.form.controls.techRecord_dda_wheelchairCapacity.valid).toBe(false);
		});

		it('should mark wheelchair fittings as invalid beyond the max length', () => {
			component.form.controls.techRecord_dda_wheelchairFittings.setValue('a'.repeat(251));
			expect(component.form.controls.techRecord_dda_wheelchairFittings.valid).toBe(false);
		});
	});
});
