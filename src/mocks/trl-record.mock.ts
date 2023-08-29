import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { EuVehicleCategories, FrameDescriptions, StatusCodes, VehicleConfigurations, approvalType } from '../app/models/vehicle-tech-record.model';

export const createMockTrl = (systemNumber: number): TechRecordType<'trl'> => ({
  systemNumber: `TRL`,
  vin: `XMGDE04FS0H0${12344 + systemNumber + 1}`,
  trailerId: 'TestId',
  techRecord_createdAt: new Date().toISOString(),
  techRecord_createdByName: 'Nathan',
  techRecord_statusCode: StatusCodes.CURRENT,
  techRecord_vehicleType: 'trl',
  techRecord_regnDate: '1234',
  techRecord_firstUseDate: '1234',
  techRecord_manufactureYear: 2022,
  techRecord_noOfAxles: 2,
  techRecord_brakes_dtpNumber: '1234',
  techRecord_brakes_loadSensingValve: true,
  techRecord_brakes_antilockBrakingSystem: true,

  techRecord_dimensions_length: 25000,
  techRecord_dimensions_width: 10000,
  techRecord_suspensionType: '1',
  techRecord_roadFriendly: true,

  techRecord_vehicleClass_description: 'trailer',
  techRecord_vehicleClass_code: '1',
  techRecord_vehicleConfiguration: VehicleConfigurations.ARTICULATED,
  techRecord_couplingType: '1',
  techRecord_maxLoadOnCoupling: 1234,
  techRecord_frameDescription: FrameDescriptions.FRAME_SECTION,
  techRecord_euVehicleCategory: EuVehicleCategories.M1,
  techRecord_departmentalVehicleMarker: true,
  techRecord_reasonForCreation: 'Brake Failure',
  techRecord_approvalType: approvalType.ECSSTA,
  techRecord_approvalTypeNumber: 'approval123',
  techRecord_ntaNumber: 'nta789',
  techRecord_variantNumber: 'variant123456',
  techRecord_variantVersionNumber: 'variantversion123456',
  techRecord_plates: [
    {
      plateSerialNumber: '12345',
      plateIssueDate: new Date().toISOString(),
      plateReasonForIssue: 'Replacement',
      plateIssuer: 'person'
    }
  ],
  techRecord_axles: [
    {
      parkingBrakeMrk: true,
      axleNumber: 1,
      brakes_brakeActuator: 1,
      brakes_leverLength: 1,
      brakes_springBrakeParking: true,
      weights_gbWeight: 1,
      weights_designWeight: 2,
      weights_ladenWeight: 3,
      weights_kerbWeight: 4,
      tyres_tyreCode: 1,
      tyres_tyreSize: '2',
      tyres_plyRating: '3',
      tyres_fitmentCode: 'single',
      tyres_dataTrAxles: 1,
      tyres_speedCategorySymbol: 'a7'
    },
    {
      parkingBrakeMrk: true,
      axleNumber: 2,
      brakes_brakeActuator: 1,
      brakes_leverLength: 1,
      brakes_springBrakeParking: false,
      weights_gbWeight: 1,
      weights_designWeight: 2,
      weights_ladenWeight: 3,
      weights_kerbWeight: 4,
      tyres_tyreCode: 1,
      tyres_tyreSize: '2',
      tyres_plyRating: '3',
      tyres_fitmentCode: 'single',
      tyres_dataTrAxles: 1,
      tyres_speedCategorySymbol: 'a7'
    },
    {
      parkingBrakeMrk: false,
      axleNumber: 3,
      brakes_brakeActuator: 1,
      brakes_leverLength: 1,
      brakes_springBrakeParking: true,
      weights_gbWeight: 1,
      weights_designWeight: 2,
      weights_ladenWeight: 3,
      weights_kerbWeight: 4,
      tyres_tyreCode: 1,
      tyres_tyreSize: '2',
      tyres_plyRating: '3',
      tyres_fitmentCode: 'single',
      tyres_dataTrAxles: 1,
      tyres_speedCategorySymbol: 'a7'
    }
  ]
});
