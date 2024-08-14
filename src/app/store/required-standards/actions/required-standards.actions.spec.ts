import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from './required-standards.actions';

describe('Required Standards Actions', () => {
	it('should return correct types', () => {
		expect(getRequiredStandards.type).toBe('[Required Standards] getRequiredStandards');
		expect(getRequiredStandardsSuccess.type).toBe('[Required Standards] getRequiredStandards Success');
		expect(getRequiredStandardsFailure.type).toBe('[Required Standards] getRequiredStandards Failure');
	});
});
