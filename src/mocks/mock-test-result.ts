import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema, TestStationTypes, VehicleType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
import { OdometerReadingUnits } from '@models/test-types/odometer-unit.enum';
import { VehicleTypes } from '../app/models/vehicle-tech-record.model';
import { createMockTestType } from './test-type.mock';

export const mockTestResult = (i = 0, vehicleType: VehicleType = 'psv', systemNumber = 'SYS0001'): TestResultSchema => {
	const testResult = {
		testResultId: `TestResultId${String(i + 1).padStart(4, '0')}`,
		systemNumber,
		vin: 'XMGDE02FS0H012345',
		vrm: 'KP02ABC',
		createdAt: new Date().toISOString(),
		testStartTimestamp: new Date().toISOString(),
		testTypes: [createMockTestType(), createMockTestType()],
		trailerId: `C${String(i + 1).padStart(5, '0')}`,
		countryOfRegistration: 'gb',
		euVehicleCategory: EUVehicleCategory.M3,
		odometerReading: 100,
		odometerReadingUnits: OdometerReadingUnits.KILOMETRES,
		reasonForCreation: 'mock test result data',
		preparerName: 'Durrell Truck & Van Centre',
		preparerId: 'CM2254',
		testStationName: 'Abshire-Kub',
		testStationPNumber: 'P12346',
		testStationType: 'atf' as TestStationTypes,
		testerName: 'John Smith',
		testerEmailAddress: 'john.smith@dvsa.gov.uk',
		testStatus: TestStatus.SUBMITTED,
		vehicleType,
		testVersion: 'Current',
		createdByName: 'Jane Doe',
		testHistory: [
			mockTestResultArchived(0, `TestResultId${String(i + 1).padStart(4, '0')}`, vehicleType, systemNumber),
			mockTestResultArchived(1, `TestResultId${String(i + 1).padStart(4, '0')}`, vehicleType, systemNumber),
			mockTestResultArchived(2, `TestResultId${String(i + 1).padStart(4, '0')}`, vehicleType, systemNumber),
			mockTestResultArchived(3, `TestResultId${String(i + 1).padStart(4, '0')}`, vehicleType, systemNumber),
			mockTestResultArchived(4, `TestResultId${String(i + 1).padStart(4, '0')}`, vehicleType, systemNumber),
		],
		testEndTimestamp: new Date().toISOString(),
		testerStaffId: 'testerStaffId',
	} as TestResultSchema;

	return testResult;
};

export const mockTestResultArchived = (
	i = 0,
	testResultId = 'TestResultId0001',
	vehicleType: VehicleType = 'psv',
	systemNumber = 'SYS0001'
) => {
	const date = new Date('2022-01-02');
	const createdAt = date.setDate(date.getDate() - (i + 1));
	const testResult = {
		testResultId,
		createdAt: new Date(createdAt).toISOString(),
		systemNumber,
		vin: 'XMGDE02FS0H012345',
		vrm: 'KP02 ABC',
		testStartTimestamp: new Date().toISOString(),
		testTypes: [createMockTestType(), createMockTestType()],
		testEndTimestamp: new Date().toISOString(),
		testerStaffId: 'testerStaffId',
		createdByName: `Person ${i}`,
		trailerId: `C${String(i + 1).padStart(5, '0')}`,
		countryOfRegistration: 'gb',
		euVehicleCategory: EUVehicleCategory.M3,
		odometerReading: 100,
		odometerReadingUnits: OdometerReadingUnits.KILOMETRES,
		reasonForCreation: `reason ${i}`,
		preparerName: 'Durrell Truck & Van Centre',
		preparerId: 'CM2254',
		testStationName: 'Abshire-Kub',
		testStationPNumber: 'P12346',
		testStationType: 'atf' as TestStationTypes,
		testerName: `tester ${i}`,
		testerEmailAddress: 'john.smith@dvsa.gov.uk',
		testVersion: 'Archived',
		vehicleType: vehicleType,
		noOfAxles: 2,
	} as TestResultSchema;

	return testResult;
};

export const mockTestResultList = (items = 1, systemNumber = 'PSV') => {
	switch (systemNumber.substring(0, 3)) {
		case 'HGV':
			return new Array(items).fill(0).map((_, i) => mockTestResult(i, VehicleTypes.HGV, systemNumber));
		case 'TRL':
			return new Array(items).fill(0).map((_, i) => mockTestResult(i, VehicleTypes.TRL, systemNumber));
		default:
			return new Array(items).fill(0).map((_, i) => mockTestResult(i));
	}
};
