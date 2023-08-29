import { HGVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { BodyTypeDescription } from '@models/body-type-enum';
import { EuVehicleCategories, FuelTypes, StatusCodes, VehicleConfigurations, approvalType } from '../app/models/vehicle-tech-record.model';

export const createMockHgv = (systemNumber: number): TechRecordType<'hgv'> => ({
  systemNumber: `HGV`,
  vin: `XMGDE04FS0H0${12344 + systemNumber + 1}`,
  primaryVrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
  secondaryVrms: ['secondVrm'],
  createdTimestamp: new Date().toISOString(),

  techRecord_createdAt: new Date().toISOString(),
  techRecord_createdById: 'NathanId',
  techRecord_createdByName: 'Nathan',
  techRecord_reasonForCreation: 'Brake Failure',
  techRecord_statusCode: StatusCodes.CURRENT,
  techRecord_vehicleType: 'hgv',
  techRecord_regnDate: '1234',
  techRecord_manufactureYear: 2022,
  techRecord_noOfAxles: 2,
  techRecord_brakes_dtpNumber: '1234',
  techRecord_speedLimiterMrk: true,
  techRecord_tachoExemptMrk: true,
  techRecord_euroStandard: '123',
  techRecord_roadFriendly: true,
  techRecord_fuelPropulsionSystem: FuelTypes.HYBRID,
  techRecord_drawbarCouplingFitted: true,
  techRecord_vehicleClass_description: 'heavy goods vehicle',
  techRecord_vehicleClass_code: '1',
  techRecord_vehicleConfiguration: VehicleConfigurations.ARTICULATED,
  techRecord_offRoad: true,
  techRecord_euVehicleCategory: EuVehicleCategories.M1,
  techRecord_emissionsLimit: 1234,
  techRecord_departmentalVehicleMarker: true,
  techRecord_approvalType: approvalType.ECSSTA,
  techRecord_approvalTypeNumber: 'approval123',
  techRecord_ntaNumber: 'nta789',
  techRecord_variantNumber: 'variant123456',
  techRecord_variantVersionNumber: 'variantversion123456',
  techRecord_dimensions_length: 1,
  techRecord_dimensions_width: 2,
  techRecord_frontAxleToRearAxle: 3,
  techRecord_frontVehicleTo5thWheelCouplingMin: 5,
  techRecord_frontVehicleTo5thWheelCouplingMax: 6,
  techRecord_frontAxleTo5thWheelMin: 7,
  techRecord_frontAxleTo5thWheelMax: 8,
  techRecord_make: '1234',
  techRecord_model: '1234',
  techRecord_bodyType_description: BodyTypeDescription.OTHER,
  techRecord_functionCode: '1',
  techRecord_conversionRefNo: '1234',
  techRecord_grossGbWeight: 2,
  techRecord_grossEecWeight: 4,
  techRecord_grossDesignWeight: 3,
  techRecord_trainGbWeight: 3,
  techRecord_trainEecWeight: 3,
  techRecord_trainDesignWeight: 7,
  techRecord_axles: [
    {
      axleNumber: 1,
      parkingBrakeMrk: false
    } as HGVAxles,
    {
      axleNumber: 2,
      parkingBrakeMrk: true
    } as HGVAxles
  ],
  techRecord_plates: [
    {
      plateSerialNumber: '12345',
      plateIssueDate: new Date().toISOString() as string,
      plateReasonForIssue: 'Replacement',
      plateIssuer: 'person'
    },
    {
      plateSerialNumber: '54321',
      plateIssueDate: new Date().toISOString() as string,
      plateReasonForIssue: 'Replacement',
      plateIssuer: 'person 2'
    }
  ]
});
