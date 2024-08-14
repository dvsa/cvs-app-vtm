import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestStationType } from '@models/test-stations/test-station-type.enum';
import { OdometerReadingUnits } from '@models/test-types/odometer-unit.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

export const createMockTestResult = (params: Partial<TestResultModel> = {}): TestResultModel => ({
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
	testStationType: TestStationType.ATF,
	testerName: '',
	testerEmailAddress: '',
	testerStaffId: '',
	vehicleType: VehicleTypes.CAR,
	...params,
});
