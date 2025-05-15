import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';

import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { AdrSectionEditComponent } from '../adr-section-edit.component';

describe('AdrSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: AdrSectionEditComponent;
	let fixture: ComponentFixture<AdrSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AdrSectionEditComponent],
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

		fixture = TestBed.createComponent(AdrSectionEditComponent);
		fixture.componentRef.setInput('techRecord', createMockHgv(100000));
		component = fixture.componentInstance;
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
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

	describe('addTC3TankInspection', () => {
		it('should add an empty TC3 tank inspection to the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			const spy = jest.spyOn(arr, 'push');
			component.addTC3TankInspection();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('removeTC3TankInspection', () => {
		it('should remove the TC3 tank inspection at the specified index from the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			const spy = jest.spyOn(arr, 'removeAt');
			component.removeTC3TankInspection(1);
			expect(spy).toHaveBeenCalledWith(1);
		});
	});

	describe('addUNNumber', () => {
		it('should not allow the adding of a UN number if the previous one is empty', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			const spy = jest.spyOn(arr, 'push');
			component.addUNNumber();
			expect(spy).not.toHaveBeenCalled();
		});
		it('should add an empty UN number to the form array if the all prior ones are filled in', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			arr.patchValue(['123']);
			const spy = jest.spyOn(arr, 'push');
			component.addUNNumber();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('removeUNNumber', () => {
		it('should remove the UN number at the specified index from the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			const spy = jest.spyOn(arr, 'removeAt');
			component.removeUNNumber(1);
			expect(spy).toHaveBeenCalledWith(1);
		});
	});

	describe('handleADRBodyTypeChange', () => {
		it('should subscribe to ADR body type changes', () => {
			const spy = jest.spyOn(
				component.form.controls.techRecord_adrDetails_vehicleDetails_type.valueChanges,
				'subscribe'
			);
			component.handleADRBodyTypeChange();
			expect(spy).toHaveBeenCalled();
		});

		it('should clear any selected explosives if the body type is changed to battery or tank', () => {
			// Valid options for tractor
			component.form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.ARTIC_TRACTOR,
				techRecord_adrDetails_permittedDangerousGoods: [
					ADRDangerousGood.AT,
					ADRDangerousGood.EXPLOSIVES_TYPE_2,
					ADRDangerousGood.EXPLOSIVES_TYPE_3,
				],
			});

			component.handleADRBodyTypeChange();

			// Change body type to battery
			component.form.patchValue({
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_BATTERY,
			});

			expect(component.form.controls.techRecord_adrDetails_compatibilityGroupJ.value).toBeNull();
			expect(component.form.controls.techRecord_adrDetails_permittedDangerousGoods.value).not.toContain(
				ADRDangerousGood.EXPLOSIVES_TYPE_2
			);
			expect(component.form.controls.techRecord_adrDetails_permittedDangerousGoods.value).not.toContain(
				ADRDangerousGood.EXPLOSIVES_TYPE_3
			);
		});

		it('should set the permitted dangerous goods options based on the body type', () => {
			// Valid options for tractor
			component.form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.ARTIC_TRACTOR,
				techRecord_adrDetails_permittedDangerousGoods: [
					ADRDangerousGood.AT,
					ADRDangerousGood.EXPLOSIVES_TYPE_2,
					ADRDangerousGood.EXPLOSIVES_TYPE_3,
				],
			});

			const options = getOptionsFromEnum(ADRDangerousGood);
			expect(component.permittedDangerousGoodsOptions).toEqual(options);

			component.handleADRBodyTypeChange();

			// Change body type to battery
			component.form.patchValue({
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_BATTERY,
			});

			expect(component.permittedDangerousGoodsOptions).toEqual(
				options.filter(
					(option) =>
						option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_2 && option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_3
				)
			);
		});
	});
});
