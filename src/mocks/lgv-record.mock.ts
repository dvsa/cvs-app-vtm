import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryLgv.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationHgvPsv.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { StatusCodes } from '@models/vehicle-tech-record.model';

export const createMockLgv = (systemNumber: number): TechRecordType<'lgv'> => ({
	systemNumber: 'LGV',
	vin: `XMGDE04FS0H0${12344 + systemNumber + 1}`,
	secondaryVrms: null,
	createdTimestamp: new Date().toISOString(),
	techRecord_createdAt: new Date().toISOString(),
	techRecord_createdByName: 'Nathan',
	techRecord_statusCode: StatusCodes.CURRENT,
	techRecord_vehicleType: 'lgv',
	techRecord_regnDate: '1234',
	techRecord_manufactureYear: 2022,
	techRecord_noOfAxles: 2,
	techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
	techRecord_euVehicleCategory: EUVehicleCategory.N1,
	techRecord_reasonForCreation: 'Brake Failure',
	techRecord_createdById: '0',
});
