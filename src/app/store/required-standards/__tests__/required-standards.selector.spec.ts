import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/required-standards/defects/enums/euVehicleCategory.enum.js';
import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { INSPECTION_TYPE } from '@models/test-results/test-result-required-standard.model';
import { RequiredStandardState, initialRequiredStandardsState } from '../required-standards.reducer';
import {
	getRequiredStandardFromTypeAndRef,
	getRequiredStandardsState,
	requiredStandardsLoadingState,
} from '../required-standards.selector';

describe('RequiredStandardsLoadingState', () => {
	it('should return loading state', () => {
		const state: RequiredStandardState = { ...initialRequiredStandardsState, loading: true };
		const selectedState = requiredStandardsLoadingState.projector(state);
		expect(selectedState).toBeTruthy();
	});

	describe('getRequiredStandardsState', () => {
		it('should return me the required standards state', () => {
			const state: RequiredStandardState = { ...initialRequiredStandardsState, loading: false };
			const selectedState = getRequiredStandardsState.projector(state);
			expect(selectedState).toBeTruthy();
		});
	});

	describe('getRequiredStandardFromTypeAndRef', () => {
		it('should return me the required standards state when given a inspection type and ref', () => {
			const requiredStandard = {
				rsNumber: 1,
				requiredStandard: 'rs',
				refCalculation: '01.1',
				additionalInfo: false,
				inspectionTypes: [INSPECTION_TYPE.NORMAL],
			};
			const requiredStandards: DefectGETRequiredStandards = {
				normal: [
					{
						sectionNumber: '01',
						sectionDescription: 'desc',
						requiredStandards: [
							{
								rsNumber: 1,
								requiredStandard: 'rs',
								refCalculation: '01.1',
								additionalInfo: false,
								inspectionTypes: [INSPECTION_TYPE.NORMAL],
							},
						],
					},
				],
				basic: [],
				euVehicleCategories: [EUVehicleCategory.M1],
			};
			initialRequiredStandardsState.requiredStandards = requiredStandards;
			const state: RequiredStandardState = { ...initialRequiredStandardsState, loading: false };
			const selectedState = getRequiredStandardFromTypeAndRef(INSPECTION_TYPE.NORMAL, '01.1').projector(state);
			expect(selectedState).toBeTruthy();
			expect(selectedState).toStrictEqual({ ...requiredStandard, sectionNumber: '01', sectionDescription: 'desc' });
		});
		it('should return undefined if no section or RS is found', () => {
			const requiredStandards: DefectGETRequiredStandards = {
				normal: [
					{
						sectionNumber: '01',
						sectionDescription: 'desc',
						requiredStandards: [
							{
								rsNumber: 1,
								requiredStandard: 'rs',
								refCalculation: '01.1',
								additionalInfo: false,
								inspectionTypes: [INSPECTION_TYPE.NORMAL],
							},
						],
					},
				],
				basic: [],
				euVehicleCategories: [EUVehicleCategory.M1],
			};
			initialRequiredStandardsState.requiredStandards = requiredStandards;
			const state: RequiredStandardState = { ...initialRequiredStandardsState, loading: false };
			const selectedState = getRequiredStandardFromTypeAndRef(INSPECTION_TYPE.NORMAL, 'data').projector(state);
			expect(selectedState).toBeUndefined();
		});
	});
});
