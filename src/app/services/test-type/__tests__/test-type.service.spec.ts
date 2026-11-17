import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TestTypeService } from '../test-type.service';

describe('TestTypeService', () => {
	const service = new TestTypeService();

	it.each([
		['41', true],
		['95', true],
		['1', false],
		['unknown', false],
	])('classifies first test %s as %s', (id, expected) => {
		expect(service.isTestTypeFirstTest(id)).toBe(expected);
	});

	it.each([
		['38', true],
		['47', true],
		['48', true],
		['1', false],
	])('classifies notifiable alteration %s as %s', (id, expected) => {
		expect(service.isTestTypeNotifiableAlteration(id)).toBe(expected);
	});

	it.each([
		['142', true],
		['143', true],
		['175', true],
		['176', true],
		['1', false],
	])('classifies COIF test %s as %s', (id, expected) => {
		expect(service.isTestTypeCOIF(id)).toBe(expected);
	});

	it.each([
		['125', true],
		['439', true],
		['449', true],
		['1', false],
	])('classifies IVA test %s as %s', (id, expected) => {
		expect(service.isTestTypeIVA(id)).toBe(expected);
	});

	it.each([
		['441', false],
		['442', false],
		['39', false],
		['201', false],
		['45', false],
		['44', false],
		['1', true],
		['125', true],
	])('allows abandonment of test %s: %s', (id, expected) => {
		expect(service.isTestTypeAbandonable(id)).toBe(expected);
	});

	it.each([
		['49', VehicleTypes.HGV, ReferenceDataResourceType.TirReasonsForAbandoning],
		['57', VehicleTypes.TRL, ReferenceDataResourceType.TirReasonsForAbandoning],
		['133', VehicleTypes.MOTORCYCLE, ReferenceDataResourceType.MsvaReasonsForAbandoning],
		['198', VehicleTypes.MOTORCYCLE, ReferenceDataResourceType.MsvaReasonsForAbandoning],
		['125', VehicleTypes.CAR, ReferenceDataResourceType.SpecialistReasonsForAbandoning],
		['142', VehicleTypes.PSV, ReferenceDataResourceType.SpecialistReasonsForAbandoning],
		['143', VehicleTypes.PSV, ReferenceDataResourceType.SpecialistReasonsForAbandoning],
		['147', VehicleTypes.PSV, ReferenceDataResourceType.SpecialistReasonsForAbandoning],
		['153', VehicleTypes.CAR, ReferenceDataResourceType.SpecialistReasonsForAbandoning],
		['1', VehicleTypes.PSV, ReferenceDataResourceType.ReasonsForAbandoningPsv],
		['40', VehicleTypes.HGV, ReferenceDataResourceType.ReasonsForAbandoningHgv],
		['94', VehicleTypes.TRL, ReferenceDataResourceType.ReasonsForAbandoningTrl],
	] as const)('selects abandonment reasons for test %s on a %s', (testTypeId, vehicleType, resource) => {
		const result = createMockTestResult({
			vehicleType,
			testTypes: [createMockTestType({ testTypeId, testResult: TestResults.ABANDONED })],
		});

		expect(service.getAbandonReasonsResourceType(result)).toBe(resource);
	});

	it('rejects unsupported vehicle types when the test has no specialist reasons', () => {
		const result = createMockTestResult({
			vehicleType: VehicleTypes.CAR,
			testTypes: [createMockTestType({ testTypeId: '1', testResult: TestResults.ABANDONED })],
		});

		expect(() => service.getAbandonReasonsResourceType(result)).toThrow('Unexpected vehicle type');
	});
});
