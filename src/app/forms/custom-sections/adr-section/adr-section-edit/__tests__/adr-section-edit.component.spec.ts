import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';

import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { of } from 'rxjs';
import { AdrSectionEditComponent } from '../adr-section-edit.component';

describe('AdrSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: AdrSectionEditComponent;
	let fixture: ComponentFixture<AdrSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;
	let route: ActivatedRoute;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AdrSectionEditComponent],
			providers: [
				provideRouter([]),
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{
					provide: ActivatedRoute,
					useValue: { params: of([{ id: 1 }]), snapshot: { data: { reason: 'add-additional-note' } } },
				},
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);
		route = TestBed.inject(ActivatedRoute);

		fixture = TestBed.createComponent(AdrSectionEditComponent);
		fixture.componentRef.setInput('techRecord', createMockHgv(100000));
		component = fixture.componentInstance;
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const spy = vi.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from all subscriptions', () => {
			const spy = vi.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});

		it('should detach its form from its parent form', () => {
			const spy = vi.spyOn(controlContainer.control as FormGroup, 'removeControl');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('addTC3TankInspection', () => {
		it('should add an empty TC3 tank inspection to the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			const spy = vi.spyOn(arr, 'push');
			component.addTC3TankInspection();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('removeTC3TankInspection', () => {
		it('should remove the TC3 tank inspection at the specified index from the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			const spy = vi.spyOn(arr, 'removeAt');
			component.removeTC3TankInspection(1);
			expect(spy).toHaveBeenCalledWith(1);
		});
	});

	describe('addUNNumber', () => {
		it('should not allow the adding of a UN number if the previous one is empty', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			const spy = vi.spyOn(arr, 'push');
			component.addUNNumber();
			expect(spy).not.toHaveBeenCalled();
		});
		it('should add an empty UN number to the form array if the all prior ones are filled in', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			arr.patchValue(['123']);
			const spy = vi.spyOn(arr, 'push');
			component.addUNNumber();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('removeUNNumber', () => {
		it('should remove the UN number at the specified index from the form array', () => {
			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			const spy = vi.spyOn(arr, 'removeAt');
			component.removeUNNumber(1);
			expect(spy).toHaveBeenCalledWith(1);
		});
	});

	describe('handleADRBodyTypeChange', () => {
		it('should subscribe to ADR body type changes', () => {
			const spy = vi.spyOn(component.form.controls.techRecord_adrDetails_vehicleDetails_type.valueChanges, 'subscribe');
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
			expect(component.permittedDangerousGoodsOptions()).toEqual(options);

			component.handleADRBodyTypeChange();

			// Change body type to battery
			component.form.patchValue({
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_BATTERY,
			});

			expect(component.permittedDangerousGoodsOptions()).toEqual(
				options.filter(
					(option) =>
						option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_2 && option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_3
				)
			);
		});
	});

	describe('handleInitialiseUNNumbers', () => {
		it('should prepopulate the form array with existing UN numbers from the tech record', () => {
			const mockTechRecord = createMockHgv(1);
			mockTechRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = ['UN1', 'UN2'];
			fixture.componentRef.setInput('techRecord', mockTechRecord);

			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			arr.clear();

			component.handleInitialiseUNNumbers();

			expect(arr.length).toBe(2);
			expect(arr.value).toEqual(['UN1', 'UN2']);
		});

		it('should push a single empty UN number control when there are none on the tech record', () => {
			const mockTechRecord = createMockHgv(2);
			mockTechRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = undefined;
			fixture.componentRef.setInput('techRecord', mockTechRecord);

			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			arr.clear();

			component.handleInitialiseUNNumbers();

			expect(arr.length).toBe(1);
			expect(arr.at(0).value).toBeNull();
		});

		it('should push a single empty UN number control when the tech record has an empty UN number array', () => {
			const mockTechRecord = createMockHgv(3);
			mockTechRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = [];
			fixture.componentRef.setInput('techRecord', mockTechRecord);

			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
			arr.clear();

			component.handleInitialiseUNNumbers();

			expect(arr.length).toBe(1);
			expect(arr.at(0).value).toBeNull();
		});
	});

	describe('handleInitialiseSubsequentTankInspections', () => {
		it('should add a TC3 tank inspection for every existing tc3Details entry on the tech record', () => {
			const mockTechRecord = createMockHgv(4);
			mockTechRecord.techRecord_adrDetails_tank_tankDetails_tc3Details = [{}, {}, {}] as never;
			fixture.componentRef.setInput('techRecord', mockTechRecord);

			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			arr.clear();

			component.handleInitialiseSubsequentTankInspections();

			expect(arr.length).toBe(3);
		});

		it('should not add any TC3 tank inspections when there are none on the tech record', () => {
			const mockTechRecord = createMockHgv(5);
			mockTechRecord.techRecord_adrDetails_tank_tankDetails_tc3Details = undefined;
			fixture.componentRef.setInput('techRecord', mockTechRecord);

			const arr = component.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details;
			arr.clear();

			component.handleInitialiseSubsequentTankInspections();

			expect(arr.length).toBe(0);
		});
	});

	describe('getEditAdditionalExaminerNotePage', () => {
		it('should dispatch updateScrollPosition and navigate to the edit-additional-examiner-note route', () => {
			const dispatchSpy = vi.spyOn(store, 'dispatch');
			const router = TestBed.inject(Router);
			const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

			component.getEditAdditionalExaminerNotePage(2);

			expect(dispatchSpy).toHaveBeenCalled();
			expect(navigateSpy).toHaveBeenCalledWith(
				[`../${route.snapshot.data['reason']}/edit-additional-examiner-note/2`],
				expect.objectContaining({ relativeTo: route })
			);
		});
	});

	describe('canDisplayDangerousGoodsWarning', () => {
		it('should return a warning message when dangerous goods is unchecked, dirty, and differs from the stored value', () => {
			const mockTechRecord = createMockHgv(6);
			mockTechRecord.techRecord_adrDetails_dangerousGoods = true;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();

			component.form.controls.techRecord_adrDetails_dangerousGoods.setValue(false);
			component.form.controls.techRecord_adrDetails_dangerousGoods.markAsDirty();

			expect(component.canDisplayDangerousGoodsWarning).toBe(
				'By selecting this field it will delete all previous ADR field inputs'
			);
		});

		it('should return null when the control is not dirty', () => {
			const mockTechRecord = createMockHgv(7);
			mockTechRecord.techRecord_adrDetails_dangerousGoods = true;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();

			component.form.controls.techRecord_adrDetails_dangerousGoods.setValue(false);
			component.form.controls.techRecord_adrDetails_dangerousGoods.markAsPristine();

			expect(component.canDisplayDangerousGoodsWarning).toBeNull();
		});

		it('should return null when the value has not changed from the stored value', () => {
			const mockTechRecord = createMockHgv(8);
			mockTechRecord.techRecord_adrDetails_dangerousGoods = false;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();

			component.form.controls.techRecord_adrDetails_dangerousGoods.setValue(false);
			component.form.controls.techRecord_adrDetails_dangerousGoods.markAsDirty();

			expect(component.canDisplayDangerousGoodsWarning).toBeNull();
		});

		it('should return null when the new value is true', () => {
			const mockTechRecord = createMockHgv(9);
			mockTechRecord.techRecord_adrDetails_dangerousGoods = false;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();

			component.form.controls.techRecord_adrDetails_dangerousGoods.setValue(true);
			component.form.controls.techRecord_adrDetails_dangerousGoods.markAsDirty();

			expect(component.canDisplayDangerousGoodsWarning).toBeNull();
		});
	});
});
