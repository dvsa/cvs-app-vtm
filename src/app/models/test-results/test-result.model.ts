import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TestStationType } from '@models/test-stations/test-station-type.enum';
import { OdometerReadingUnits } from '@models/test-types/odometer-unit.enum';
import { TestType } from '@models/test-types/test-type.model';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { VehicleSize } from '@models/vehicle-size.enum';
import { StatusCodes, VehicleSubclass, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechRecordBodyType } from '@models/vehicle/techRecordBodyType';
import { TestResultStatus } from './test-result-status.enum';
import { TestCodes } from './testCodes.enum';
import { TypeOfTest } from './typeOfTest.enum';

export interface TestResultModel {
	testResultId: string;

	systemNumber: string;
	vin: string;
	vrm?: string; // Mandatory for PSV and HGV, not applicable to TRL

	createdAt?: string;
	testStartTimestamp: string | Date;
	testEndTimestamp: string | Date;

	testTypes: TestType[];

	trailerId: string;
	countryOfRegistration: string;
	euVehicleCategory: EUVehicleCategory | null;
	odometerReading: number;
	odometerReadingUnits: OdometerReadingUnits;
	preparerName: string;
	preparerId: string;

	testStationName: string;
	testStationPNumber: string;
	testStationType: TestStationType;
	testerName: string;
	testerEmailAddress: string;
	testerStaffId: string;

	reasonForCreation?: string;
	reasonForCancellation?: string;
	vehicleType: VehicleTypes;
	testHistory?: TestResultModel[];
	testStatus?: TestResultStatus;

	make?: string;
	model?: string | null;
	bodyType?: TechRecordBodyType;

	/**
	 * Applicable only when updating/creating a test from VTM
	 */
	createdByName?: string;
	createdById?: string;
	lastUpdatedByName?: string;
	typeOfTest?: TypeOfTest;
	contingencyTestNumber?: string;
	source?: string;
	lastUpdatedById?: string;
	testVersion?: string | null;
	testCode?: TestCodes;

	vehicleSize?: VehicleSize;
	vehicleConfiguration?: VehicleConfiguration | null;
	noOfAxles?: number;
	vehicleClass?: VehicleClass;
	vehicleSubclass?: Array<VehicleSubclass>;
	numberOfWheelsDriven?: number;
	statusCode?: StatusCodes;
	/**
	 * Used only for TRL
	 */
	firstUseDate?: string;

	recalls?: RecallsSchema;
}
