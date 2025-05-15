import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Defect } from '@models/defects/defect.model';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { defects, selectByImNumber } from '@store/defects';
import { State, initialAppState } from '@store/index';
import { selectRouteParams } from '@store/router/router.selectors';
import { createDefect, removeDefect, toEditOrNotToEdit, updateDefect } from '@store/test-records';
import { DefectComponent } from '../defect.component';

describe('DefectComponent', () => {
	let component: DefectComponent;
	let fixture: ComponentFixture<DefectComponent>;
	let router: Router;
	let store: MockStore<State>;

	const deficiency: Deficiency = {
		deficiencyCategory: deficiencyCategory.Major,
		deficiencyId: 'a',
		deficiencySubId: '',
		deficiencyText: 'missing.',
		forVehicleType: [VehicleTypes.PSV],
		ref: '1.1.a',
		stdForProhibition: false,
	};

	const item: Item = {
		deficiencies: [deficiency],
		forVehicleType: [VehicleTypes.PSV],
		itemDescription: 'A registration plate:',
		itemNumber: 1,
	};

	const defect: Defect = {
		additionalInfo: {
			[VehicleTypes.PSV]: {
				location: {
					longitudinal: ['front', 'rear'],
				},
				notes: true,
			},
		},
		forVehicleType: [VehicleTypes.PSV],
		imDescription: 'Registration Plate',
		imNumber: 1,
		items: [item],
	};

	const fakeActivatedRoute = {
		snapshot: { data: { key: 'value' } },
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientTestingModule],
			providers: [
				{ provide: ActivatedRoute, useValue: fakeActivatedRoute },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DefectComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should navigate back to test record', () => {
		const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
		component.navigateBack();
		expect(navigateSpy).toHaveBeenCalled();
	});

	describe('should initialize info Dictionary', () => {
		it('should initialize notes to true', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultModel);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), { imNumber: 1 } as Defect);
			tick();
			fixture.detectChanges();

			component.initializeInfoDictionary(defect);
			expect(component.includeNotes).toBe(true);
		}));

		it('should initialize info dictionary to the longitude', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultModel);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), { imNumber: 1 } as Defect);
			tick();
			fixture.detectChanges();

			component.initializeInfoDictionary(defect);
			expect(component.infoDictionary).toEqual({
				longitudinal: [
					{
						label: 'Front',
						value: 'front',
					},
					{
						label: 'Rear',
						value: 'rear',
					},
				],
			});
		}));
	});

	describe('should initialize defect', () => {
		it('should initialize defect using index', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultModel);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), { imNumber: 1 } as Defect);
			tick();
			fixture.detectChanges();

			expect(component.defect).toBeDefined();
		}));

		it('should initialize defect using ref', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { ref: '1.1.a' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [
					{ defects: [{ imNumber: 1, imDescription: 'desc', deficiencyCategory: deficiencyCategory.Major }] },
				],
			} as TestResultModel);
			store.overrideSelector(defects, [defect]);
			tick();
			fixture.detectChanges();

			expect(component.defect).toBeDefined();
		}));
	});

	describe('should get isDangerous', () => {
		it('should return true when defect is dangerous', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Dangerous };
			expect(component.isDangerous).toBe(true);
		});
		it('should return false when defect is advisory', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Advisory };
			expect(component.isDangerous).toBe(false);
		});
		it('should return false when defect is major', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Major };
			expect(component.isDangerous).toBe(false);
		});
		it('should return false when defect is minor', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Minor };
			expect(component.isDangerous).toBe(false);
		});
	});

	describe('should get isAdvisory', () => {
		it('should return true when defect is advisory', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Advisory };
			expect(component.isAdvisory).toBe(true);
		});
		it('should return false when defect is dangerous', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Dangerous };
			expect(component.isAdvisory).toBe(false);
		});
		it('should return false when defect is major', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Major };
			expect(component.isAdvisory).toBe(false);
		});
		it('should return false when defect is minor', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Minor };
			expect(component.isAdvisory).toBe(false);
		});
	});

	describe('should dispatch', () => {
		it('should dispatch create defect action', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { ref: '1.1.a' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [
					{ defects: [{ imNumber: 1, imDescription: 'desc', deficiencyCategory: deficiencyCategory.Major }] },
				],
			} as TestResultModel);
			store.overrideSelector(defects, [defect]);
			tick();
			fixture.detectChanges();

			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				createDefect({ defect: component.form.getCleanValue(component.form) as TestResultDefect })
			);
		}));

		it('should dispatch update defect action', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultModel);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), { imNumber: 1 } as Defect);
			tick();
			fixture.detectChanges();

			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				updateDefect({
					defect: component.form.getCleanValue(component.form) as TestResultDefect,
					index: component.index,
				})
			);
		}));

		it('should dispatch delete defect action', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultModel);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), { imNumber: 1 } as Defect);
			tick();
			fixture.detectChanges();

			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.handleRemove();

			expect(dispatchSpy).toHaveBeenCalledWith(removeDefect({ index: component.index }));
		}));
	});
});
