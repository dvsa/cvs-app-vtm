import {
	DefectCategoryReferenceDataSchema,
	DefectDeficiencyReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsState, initialDefectsState } from '../defects.reducer';
import { defect, defects, selectByDeficiencyRef, selectByImNumber } from '../defects.selectors';

describe('Defects Selectors', () => {
	describe('adapter selectors', () => {
		it('should return correct state', () => {
			const state = { ...initialDefectsState, ids: [1], entities: { 1: { preparerId: 2 } } } as unknown as DefectsState;

			expect(defects.projector(state)).toEqual([{ preparerId: 2 }]);
			expect(defect('1').projector(state)).toEqual({ preparerId: 2 });
		});
	});

	describe('should return correct state', () => {
		const deficiency: DefectDeficiencyReferenceDataSchema = {
			deficiencyCategory: deficiencyCategory.Major,
			deficiencyId: 'a',
			deficiencySubId: '',
			deficiencyText: 'missing.',
			forVehicleType: [VehicleTypes.PSV],
			ref: '1.1.a',
			stdForProhibition: false,
		};

		const item: DefectItemReferenceDataSchema = {
			deficiencies: [deficiency],
			forVehicleType: [VehicleTypes.PSV],
			itemDescription: 'A registration plate:',
			itemNumber: 1,
		};

		const mockDefect: DefectCategoryReferenceDataSchema = {
			additionalInfo: {
				[VehicleTypes.PSV]: {
					location: {
						longitudinal: ['front', 'rear'],
					},
					notes: false,
				},
				[VehicleTypes.HGV]: {},
				[VehicleTypes.TRL]: {},
			},
			forVehicleType: [VehicleTypes.PSV],
			imDescription: 'Registration Plate',
			imNumber: 1,
			items: [item],
		};
		const defect2: DefectCategoryReferenceDataSchema = {
			additionalInfo: {
				[VehicleTypes.PSV]: {
					location: {
						longitudinal: ['front', 'rear'],
					},
					notes: false,
				},
				[VehicleTypes.HGV]: {},
				[VehicleTypes.TRL]: {},
			},
			forVehicleType: [VehicleTypes.PSV],
			imDescription: 'Registration Plate',
			imNumber: 2,
			items: [item],
		};

		const defectList = [mockDefect, defect2];

		it('should return filtered defect by IM number', () => {
			const selectedState = selectByImNumber(2, VehicleTypes.PSV).projector(defectList);
			expect(selectedState).toEqual(defect2);
		});

		it('should return filtered defect by deficiency ref', () => {
			const selectedState = selectByDeficiencyRef('1.1.a', VehicleTypes.PSV).projector(defectList);
			expect(selectedState).toEqual([mockDefect, item, deficiency]);
		});
	});
});
