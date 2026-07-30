import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
	DefectCategoryReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { DefectSelectComponent } from '../defect-select.component';

describe('DefectSelectComponent', () => {
	let component: DefectSelectComponent;
	let fixture: ComponentFixture<DefectSelectComponent>;

	const defect: DefectCategoryReferenceDataSchema = {
		additionalInfo: {
			psv: {},
			trl: {},
			hgv: {},
		},
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
			const defectWithNoItems: DefectCategoryReferenceDataSchema = { ...defect, items: [] };
			expect(component.hasItems(defectWithNoItems)).toBeFalsy();
		});
	});

	describe('hasDeficiencies', () => {
		it('should correctly detect an item with deficiencies', () => {
			expect(component.hasDeficiencies(defect.items[0])).toBeTruthy();
		});

		it('should correctly detect an item without deficiencies', () => {
			const itemWithNoDeficiencies: DefectItemReferenceDataSchema = {
				...defect.items[0],
				deficiencies: [],
			};

			expect(component.hasDeficiencies(itemWithNoDeficiencies)).toBeFalsy();
		});
	});

	describe('accordion expand/collapse', () => {
		it('toggleDefect should open and close a category', () => {
			expect(component.isDefectOpen(defect)).toBe(false);
			component.toggleDefect(defect);
			expect(component.isDefectOpen(defect)).toBe(true);
			component.toggleDefect(defect);
			expect(component.isDefectOpen(defect)).toBe(false);
		});

		it('toggleItem should open and close an item independently', () => {
			const item = defect.items[0];
			expect(component.isItemOpen(defect, item)).toBe(false);
			component.toggleItem(defect, item);
			expect(component.isItemOpen(defect, item)).toBe(true);
			component.toggleItem(defect, item);
			expect(component.isItemOpen(defect, item)).toBe(false);
		});
	});

	describe('navigation', () => {
		it('selectDeficiency should navigate to the deficiency ref', () => {
			const spy = jest.spyOn(component.router, 'navigate').mockResolvedValue(true);
			component.selectDeficiency(defect.items[0].deficiencies![0]);
			expect(spy).toHaveBeenCalledWith(['some ref'], expect.anything());
		});

		it('selectAdvisory should navigate to the advisory route', () => {
			const spy = jest.spyOn(component.router, 'navigate').mockResolvedValue(true);
			component.selectAdvisory(defect, defect.items[0]);
			expect(spy).toHaveBeenCalledWith(['1.2.advisory'], expect.anything());
		});
	});

	describe('filteredTree', () => {
		const registrationPlate: DefectCategoryReferenceDataSchema = {
			...defect,
			imDescription: 'Registration plate',
			imNumber: 1,
			items: [
				{
					itemNumber: 1,
					itemDescription: 'A registration plate:',
					forVehicleType: [VehicleTypes.PSV],
					deficiencies: [
						{
							deficiencyCategory: deficiencyCategory.Major,
							deficiencyId: 'a',
							deficiencySubId: '',
							deficiencyText: 'missing',
							forVehicleType: [VehicleTypes.PSV],
							ref: '1.1.a',
							stdForProhibition: false,
						},
					],
				},
			],
		};
		const tyres: DefectCategoryReferenceDataSchema = {
			...defect,
			imDescription: 'Condition of tyres',
			imNumber: 8,
			items: [
				{
					itemNumber: 1,
					itemDescription: 'A tyre:',
					forVehicleType: [VehicleTypes.PSV],
					deficiencies: [
						{
							deficiencyCategory: deficiencyCategory.Major,
							deficiencyId: 'e',
							deficiencySubId: '',
							deficiencyText: 'has a cut in excess of the requirements',
							forVehicleType: [VehicleTypes.PSV],
							ref: '8.1.e',
							stdForProhibition: false,
						},
						{
							deficiencyCategory: deficiencyCategory.Major,
							deficiencyId: 'f',
							deficiencySubId: '',
							deficiencyText: 'showing evidence of a recut',
							forVehicleType: [VehicleTypes.PSV],
							ref: '8.1.f',
							stdForProhibition: false,
						},
					],
				},
			],
		};

		beforeEach(() => {
			component.defects = [registrationPlate, tyres];
		});

		it('should return all defects unpruned when the filter is empty', () => {
			component.searchFilter = '';
			expect(component.filteredTree).toStrictEqual([registrationPlate, tyres]);
			expect(component.isSearching).toBe(false);
		});

		it('should keep the whole category when the category matches', () => {
			component.searchFilter = 'tyres';
			expect(component.filteredTree).toStrictEqual([tyres]);
		});

		it('should match on IM number exactly', () => {
			component.searchFilter = '8';
			expect(component.filteredTree).toStrictEqual([tyres]);
		});

		it('should match on a deficiency ref (e.g. "1.1")', () => {
			component.searchFilter = '1.1';

			const tree = component.filteredTree;
			expect(tree).toHaveLength(1);
			expect(tree[0].imNumber).toBe(1);
			expect(tree[0].items).toHaveLength(1);
			expect(tree[0].items[0].deficiencies).toHaveLength(1);
			expect(tree[0].items[0].deficiencies![0].ref).toBe('1.1.a');
		});

		it('should surface a deep deficiency-level match and prune siblings', () => {
			component.searchFilter = 'recut';

			const tree = component.filteredTree;
			expect(tree).toHaveLength(1);
			expect(tree[0].imNumber).toBe(8);
			// only the matching item survives
			expect(tree[0].items).toHaveLength(1);
			// only the matching deficiency within that item survives
			expect(tree[0].items[0].deficiencies).toHaveLength(1);
			expect(tree[0].items[0].deficiencies![0].deficiencyText).toBe('showing evidence of a recut');
		});

		it('should not mutate the source taxonomy when pruning', () => {
			component.searchFilter = 'recut';
			void component.filteredTree;
			expect(tyres.items[0].deficiencies).toHaveLength(2);
		});

		it('should return an empty array when nothing matches', () => {
			component.searchFilter = 'no such defect';
			expect(component.filteredTree).toStrictEqual([]);
		});
	});
});
