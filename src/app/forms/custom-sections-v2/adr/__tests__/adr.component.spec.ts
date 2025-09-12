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
import { updateScrollPosition } from '@store/technical-records';
import { of } from 'rxjs';
import { AdrComponent } from '../adr.component';

describe('AdrComponent', () => {
	let controlContainer: ControlContainer;
	let component: AdrComponent;
	let fixture: ComponentFixture<AdrComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AdrComponent],
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

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(AdrComponent);
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

	describe('getEditAdditionalExaminerNotePage', () => {
		it('should dispatch updateScrollPosition with current scroll position and navigate to the correct route', () => {
			const examinerNoteIndex = 2;
			const reason = 'edit';
			const expectedRoute = `../${reason}/edit-additional-examiner-note/${examinerNoteIndex}`;

			jest.spyOn(component.viewportScroller, 'getScrollPosition').mockReturnValue([0, 100]);
			jest.spyOn(component.store, 'dispatch');
			jest.spyOn(component.router, 'navigate');

			component.getEditAdditionalExaminerNotePage(examinerNoteIndex);

			expect(component.store.dispatch).toHaveBeenCalledWith(updateScrollPosition({ position: [0, 100] }));
			expect(component.router.navigate).toHaveBeenCalledWith([expectedRoute], {
				relativeTo: component.route,
				state: component.techRecord,
			});
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
