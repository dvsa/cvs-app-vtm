import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { of } from 'rxjs';
import { VehicleConfiguration } from '../app/models/vehicle-configuration.enum';
import { StatusCodes, VehicleTypes } from '../app/models/vehicle-tech-record.model';

export const mockTechRecord = {
	techRecord_statusCode: StatusCodes.CURRENT,
	techRecord_vehicleType: VehicleTypes.HGV,
	vin: '123456',
	systemNumber: '123456',
	techRecord_bodyType_description: '',
	techRecord_noOfAxles: 2,
	techRecord_reasonForCreation: 'test',
	techRecord_vehicleClass_description: 'heavy goods vehicle',
	techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
	createdTimestamp: '2022-01-01T00:00:00.000Z',
} as TechRecordType<'hgv', 'put'>;

export const TechnicalRecordServiceMock = {
	techRecord$: of(mockTechRecord),
	clearSectionTemplateStates: jest.fn(),
	updateEditingTechRecord: jest.fn(),
	getApprovalTypeAccordionDescription: jest.fn(),
	getWeightsAccordionDescription: jest.fn(),
	getTyresAccordionDescription: jest.fn(),
	getConfigAccordionDescription: jest.fn(),
	getBrakesAccordionDescription: jest.fn(),
	getVehicleTypeWithSmallTrl: jest.fn(),
	isHeavyVehicle: jest.fn(),
	isHeavyTrailer: jest.fn(),
	isAdrVehicle: jest.fn(),
	isUnique: jest.fn(),
	generateEditingVehicleTechnicalRecordFromVehicleType: jest.fn(),
};
