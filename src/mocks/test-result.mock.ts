import { TestResultSchema, TestStationTypes } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { OdometerReadingUnits } from '@models/test-types/odometer-unit.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

export const createMockTestResult = (params: Partial<TestResultSchema> = {}): TestResultSchema => {
	const testResult = {
		testResultId: '',
		systemNumber: '',
		vin: '',
		testStartTimestamp: '',
		testEndTimestamp: '',
		testTypes: [],
		trailerId: 'trailerId',
		countryOfRegistration: '',
		euVehicleCategory: EUVehicleCategory.M1,
		odometerReading: 0,
		odometerReadingUnits: OdometerReadingUnits.KILOMETRES,
		preparerName: '',
		preparerId: '',
		testStationName: '',
		testStationPNumber: '',
		testStationType: 'atf' as TestStationTypes,
		testerName: '',
		testerEmailAddress: '',
		testerStaffId: '',
		vehicleType: VehicleTypes.CAR,
		...params,
	} as TestResultSchema;

	return testResult;
};
