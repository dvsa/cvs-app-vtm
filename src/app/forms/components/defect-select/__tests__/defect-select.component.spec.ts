import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Defect } from '@models/defects/defect.model';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { Item } from '@models/defects/item.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { provideRouter } from '@angular/router';
import { DefectSelectComponent } from '../defect-select.component';

describe('DefectSelectComponent', () => {
	let component: DefectSelectComponent;
	let fixture: ComponentFixture<DefectSelectComponent>;

	const defect: Defect = {
		additionalInfo: {},
		forVehicleType: [VehicleTypes.PSV],
		imDescription: 'some description',
		imNumber: 1,
		items: [
			{
				deficiencies: [
					{
						deficiencyCategory: deficiencyCategory.Advisory,
						deficiencyId: 'some id',
						deficiencySubId: 'some sub id',
						deficiencyText: 'hey yo',
						forVehicleType: [VehicleTypes.PSV],
						ref: 'some ref',
						stdForProhibition: false,
					},
				],
				forVehicleType: [VehicleTypes.PSV],
				itemDescription: 'yolo',
				itemNumber: 2,
			},
		],
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DefectSelectComponent],
			providers: [provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DefectSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should return all types', () => {
		enum Types {
			Defect = 0,
			Item = 1,
			Deficiency = 2,
		}
		expect(component.types).toStrictEqual(Types);
	});

	describe('hasItems', () => {
		it('should correctly detect a defect with items', () => {
			expect(component.hasItems(defect)).toBeTruthy();
		});

		it('should correctly detect a defect without items', () => {
			const defectWithNoItems: Defect = { ...defect, items: [] };
			expect(component.hasItems(defectWithNoItems)).toBeFalsy();
		});
	});

	describe('hasDeficiencies', () => {
		it('should correctly detect an item with deficiencies', () => {
			expect(component.hasDeficiencies(defect.items[0])).toBeTruthy();
		});

		it('should correctly detect an item without deficiencies', () => {
			const itemWithNoDeficiencies: Item = {
				...defect.items[0],
				deficiencies: [],
			};

			expect(component.hasDeficiencies(itemWithNoDeficiencies)).toBeFalsy();
		});
	});
});
