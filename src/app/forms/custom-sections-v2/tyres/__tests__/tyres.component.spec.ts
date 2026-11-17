import { Modes } from '@/src/app/models/modes.enum';
import { AxlesService } from '@/src/app/services/axles/axles.service';
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

import { TyresComponent } from '@forms/custom-sections-v2/tyres/tyres.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { FitmentCode, Tyre, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { initialAppState } from '@store/index';
import { updateScrollPosition } from '@store/technical-records';
import { of } from 'rxjs';

const mockReferenceDataService = {
	fetchReferenceDataByKey: vi.fn(),
	loadReferenceData: vi.fn(),
	getAll$: vi.fn().mockReturnValue(of([])),
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
			techRecord_axles: new FormArray<FormGroup>([]),
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
				AxlesService,
			],
		}).compileComponents();

		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(TyresComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('mode', Modes.EDIT);
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const parentFormSpy = vi.spyOn(controlContainer.control as FormGroup, 'addControl');
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
	});

	describe('axle and tyre behaviour', () => {
		it('shows the add axle button only in edit mode when fewer than ten axles exist', () => {
			expect(component.showAddAxleButton()).toBe(true);

			componentRef.setInput('mode', Modes.SUMMARY);
			expect(component.showAddAxleButton()).toBe(false);

			componentRef.setInput('mode', Modes.EDIT);
			componentRef.setInput('techRecord', {
				...mockVehicleTechnicalRecord('hgv'),
				techRecord_noOfAxles: 10,
			});
			expect(component.showAddAxleButton()).toBe(false);
		});

		it('adds two initial axles to an empty HGV and one axle to an empty trailer', () => {
			const addAxle = vi.spyOn(component.axlesService, 'addAxle').mockImplementation(() => {});
			component.addAxle();
			expect(addAxle).toHaveBeenCalledTimes(2);
			expect(addAxle).toHaveBeenNthCalledWith(1, component.parent, VehicleTypes.HGV);

			addAxle.mockClear();
			componentRef.setInput('techRecord', {
				...mockVehicleTechnicalRecord('trl'),
				techRecord_axles: [],
			});
			component.addAxle();
			expect(addAxle).toHaveBeenCalledOnce();
			expect(addAxle).toHaveBeenCalledWith(component.parent, VehicleTypes.TRL);
		});

		it('adds tyre details to the axle with the requested axle number without mutating the input record', () => {
			const axle = { axleNumber: 2, tyres_tyreCode: 1, tyres_tyreSize: 'old size' };
			const record = { ...mockVehicleTechnicalRecord('hgv'), techRecord_axles: [axle] };
			componentRef.setInput('techRecord', record);
			const axleForm = new FormGroup({
				axleNumber: new FormControl(2),
				tyres_tyreCode: new FormControl(1),
				tyres_tyreSize: new FormControl('old size'),
				tyres_plyRating: new FormControl(null),
				tyres_dataTrAxles: new FormControl(null),
				tyres_fitmentCode: new FormControl(null),
			});
			(component.parent.get('techRecord_axles') as FormArray).push(axleForm);
			const update = vi.spyOn(component.technicalRecordService, 'updateEditingTechRecord');
			const tyre = new Tyre({
				tyreCode: 42,
				tyreSize: 'new size',
				plyRating: '12',
				dataTrAxles: 900,
				fitmentCode: FitmentCode.SINGLE,
				speedCategorySymbol: null,
			});

			component.addTyre(tyre, 2);

			expect(axleForm.getRawValue()).toEqual({
				axleNumber: 2,
				tyres_tyreCode: 42,
				tyres_tyreSize: 'new size',
				tyres_plyRating: '12',
				tyres_dataTrAxles: 900,
				tyres_fitmentCode: FitmentCode.SINGLE,
			});
			expect(update).toHaveBeenCalledWith({
				techRecord_axles: [expect.objectContaining({ axleNumber: 2, tyres_tyreCode: 42 })],
			});
			expect(record.techRecord_axles[0]).toEqual(axle);
		});

		it('ignores tyre selection when there are no axles or the axle number is unknown', () => {
			const update = vi.spyOn(component.technicalRecordService, 'updateEditingTechRecord');
			const tyre = new Tyre({ tyreCode: 42, tyreSize: 'size' });
			component.addTyre(tyre, 1);
			expect(update).not.toHaveBeenCalled();

			componentRef.setInput('techRecord', {
				...mockVehicleTechnicalRecord('hgv'),
				techRecord_axles: [{ axleNumber: 2 }],
			});
			(component.parent.get('techRecord_axles') as FormArray).push(new FormGroup({ axleNumber: new FormControl(1) }));
			component.addTyre(tyre, 1);
			expect(update).not.toHaveBeenCalled();
		});

		it('updates invalid axle weights when a GB axle weight exceeds the tyre load-index capacity', () => {
			vi.spyOn(component.technicalRecordService, 'getAxleFittingWeightValueFromLoadIndex').mockReturnValue(1000);
			const changes = {
				techRecord: {
					currentValue: {
						techRecord_axles: [
							{
								axleNumber: 1,
								tyres_dataTrAxles: 500,
								tyres_fitmentCode: FitmentCode.SINGLE,
								weights_gbWeight: 1200,
							},
							{
								axleNumber: 2,
								tyres_dataTrAxles: 500,
								tyres_fitmentCode: FitmentCode.SINGLE,
								weights_gbWeight: 900,
							},
						],
					},
				},
			} as any;

			component.checkAxleWeights(changes);

			expect(component.invalidAxles).toEqual([1]);
			expect(component.axlesService.allInvalidAxles).toEqual([1]);
		});

		it('looks up reference data when the fitment code changes but the tyre code stays the same', () => {
			const lookup = vi.spyOn(component, 'getTyresRefData');
			const currentValue = {
				techRecord_axles: [{ axleNumber: 1, tyres_fitmentCode: FitmentCode.DOUBLE, tyres_tyreCode: 10 }],
			};
			const previousValue = {
				techRecord_axles: [{ axleNumber: 1, tyres_fitmentCode: FitmentCode.SINGLE, tyres_tyreCode: 10 }],
			};

			component.checkFitmentCodeHasChanged({
				techRecord: { currentValue, previousValue, firstChange: true } as any,
			});

			expect(lookup).toHaveBeenCalledWith(1);
		});

		it('navigates to tyre search after preserving the current scroll position', () => {
			const dispatch = vi.spyOn(component.store, 'dispatch');
			const scroll = vi.spyOn(component.viewportScroller, 'getScrollPosition').mockReturnValue([10, 20]);
			const navigate = vi.spyOn(component.router, 'navigate').mockResolvedValue(true);

			component.getTyreSearchPage(2);

			expect(scroll).toHaveBeenCalledOnce();
			expect(dispatch).toHaveBeenCalledWith(updateScrollPosition({ position: [10, 20] }));
			expect(navigate).toHaveBeenCalledWith(['./tyre-search/2'], {
				relativeTo: component.route,
				state: component.techRecord(),
			});
		});

		it('does not request tyre reference data when the axle array is unavailable', () => {
			const lookup = vi.spyOn(mockReferenceDataService, 'getAll$');
			lookup.mockClear();
			component.parent.setControl('techRecord_axles', new FormControl(null));
			expect(component.getTyresRefData(1)).toBeUndefined();
			expect(lookup).not.toHaveBeenCalled();
		});
	});
});
