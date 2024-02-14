import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationTrl.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { FrameDescriptions, StatusCodes } from '@models/vehicle-tech-record.model';

export const createMockTrl = (systemNumber: number): TechRecordType<'trl'> => ({
  systemNumber: 'TRL',
  vin: `XMGDE04FS0H0${12344 + systemNumber + 1}`,
  trailerId: 'TestId',
  techRecord_createdAt: new Date().toISOString(),
  techRecord_createdByName: 'Nathan',
  techRecord_statusCode: StatusCodes.CURRENT,
  techRecord_vehicleType: 'trl',
  techRecord_regnDate: '1234',
  techRecord_firstUseDate: '1234',
  techRecord_noOfAxles: 2,
  techRecord_brakes_dtpNumber: '1234',
  techRecord_brakes_loadSensingValve: true,
  techRecord_brakes_antilockBrakingSystem: true,
  techRecord_axles: undefined,
  // TODO: V3 height missing from types package
  // techRecord_dimensions_height: 30000,
  techRecord_dimensions_length: 25000,
  techRecord_dimensions_width: 10000,
  techRecord_suspensionType: '1',
  techRecord_roadFriendly: true,
  techRecord_vehicleClass_description: 'trailer',
  techRecord_vehicleClass_code: 't',
  techRecord_vehicleConfiguration: VehicleConfiguration.SEMI_TRAILER,
  techRecord_couplingType: '1',
  techRecord_maxLoadOnCoupling: 1234,
  techRecord_frameDescription: FrameDescriptions.FRAME_SECTION,
  techRecord_euVehicleCategory: EUVehicleCategory.M1,
  techRecord_departmentalVehicleMarker: true,
  techRecord_reasonForCreation: 'Brake Failure',
  techRecord_approvalType: ApprovalType.ECSSTA,
  techRecord_approvalTypeNumber: 'approval123',
  techRecord_ntaNumber: 'nta789',
  techRecord_variantNumber: 'variant123456',
  techRecord_variantVersionNumber: 'variantversion123456',
  techRecord_plates: undefined,
  createdTimestamp: new Date().toISOString(),
  partialVin: faker.string.uuid(),
  techRecord_bodyType_code: faker.string.alpha()[0],
  techRecord_bodyType_description: faker.string.alphanumeric(),
});
