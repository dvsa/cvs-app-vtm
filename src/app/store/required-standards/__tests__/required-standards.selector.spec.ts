import {
	DefectGETRequiredStandards,
	EUVehicleCategory,
} from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { RequiredStandardState, initialRequiredStandardsState } from '../required-standards.reducer';
import {
	getRequiredStandardFromTypeAndRef,
	getRequiredStandardsState,
	requiredStandardsLoadingState,
} from '../required-standards.selector';

describe('RequiredStandardsLoadingState', () => {
	const mockTestResult = {
		euVehicleCategory: 'm1',
	} as TestResultSchema;

	it('should return loading state', () => {
		const state: RequiredStandardState = { ...initialRequiredStandardsState, loading: true };
		const selectedState = requiredStandardsLoadingState.projector(state);
		expect(selectedState).toBeTruthy();
	});

	describe('getRequiredStandardsState', () => {
		it('should return me the required standards state', () => {
			const state: RequiredStandardState = { ...initialRequiredStandardsState, loading: false };
			const selectedState = getRequiredStandardsState.projector(state.entities, mockTestResult);
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
				inspectionTypes: ['normal'],
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
								inspectionTypes: ['normal'],
							},
						],
					},
				],
				basic: [],
				euVehicleCategories: ['m1'] as EUVehicleCategory[],
			};

			const selectedState = getRequiredStandardFromTypeAndRef('normal', '01.1').projector(requiredStandards);
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
								inspectionTypes: ['normal'],
							},
						],
					},
				],
				basic: [],
				euVehicleCategories: ['m1'] as EUVehicleCategory[],
			};
			const selectedState = getRequiredStandardFromTypeAndRef('normal', 'data').projector(requiredStandards);
			expect(selectedState).toBeUndefined();
		});
	});
});
