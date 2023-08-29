import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { BodyTypeDescription } from '@models/body-type-enum';
import {
  EuVehicleCategories,
  FuelTypes,
  Retarders,
  StatusCodes,
  VehicleConfigurations,
  VehicleSizes,
  approvalType
} from '../app/models/vehicle-tech-record.model';

export const createMockPsv = (systemNumber: number): TechRecordType<'psv'> => ({
  systemNumber: `PSV`,
  vin: `XMGDE02FS0H0${12344 + systemNumber + 1}`,
  primaryVrm: `KP01ABC`,
  secondaryVrms: ['secondaryVrm'],
  createdTimestamp: 'now',
  techRecord_createdAt: new Date().toISOString() as string,
  techRecord_createdByName: 'Nathan',
  techRecord_statusCode: StatusCodes.PROVISIONAL,
  techRecord_vehicleType: 'psv',
  techRecord_regnDate: '1234',
  techRecord_manufactureYear: 2022,
  techRecord_noOfAxles: 2,
  techRecord_brakes_dtpNumber: '1234',
  techRecord_brakes_brakeCode: '1234',
  techRecord_brakes_dataTrBrakeOne: '12',
  techRecord_brakes_dataTrBrakeTwo: '34',
  techRecord_brakes_dataTrBrakeThree: '56',
  techRecord_brakes_retarderBrakeOne: Retarders.ELECTRIC,
  techRecord_brakes_retarderBrakeTwo: Retarders.ELECTRIC,
  techRecord_brakes_brakeCodeOriginal: 'original',
  techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA: 1234,
  techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA: 1234,
  techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA: 1234,
  techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB: 1234,
  techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB: 1234,
  techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB: 1234,
  techRecord_speedLimiterMrk: true,
  techRecord_speedRestriction: 54,
  techRecord_tachoExemptMrk: true,
  techRecord_euroStandard: 'Euro 4',
  techRecord_fuelPropulsionSystem: FuelTypes.HYBRID,

  techRecord_vehicleClass_description: 'large psv(ie: greater than 23 seats)',
  techRecord_vehicleClass_code: '1',
  techRecord_vehicleConfiguration: VehicleConfigurations.ARTICULATED,
  techRecord_euVehicleCategory: EuVehicleCategories.M1,
  techRecord_emissionsLimit: 1234,
  techRecord_seatsLowerDeck: 1234,
  techRecord_seatsUpperDeck: 1234,
  techRecord_standingCapacity: 1234,
  techRecord_vehicleSize: VehicleSizes.SMALL,
  techRecord_numberOfSeatbelts: '1234',
  techRecord_seatbeltInstallationApprovalDate: '1234',
  techRecord_departmentalVehicleMarker: true,

  techRecord_dimensions_height: 30000,
  techRecord_dimensions_length: 25000,
  techRecord_dimensions_width: 10000,
  techRecord_frontAxleToRearAxle: 5000,
  techRecord_approvalType: approvalType.ECSSTA,
  techRecord_approvalTypeNumber: 'approval123',
  techRecord_ntaNumber: 'nta789',
  techRecord_coifSerialNumber: 'coifSerial123456',
  techRecord_coifCertifierName: 'coifName',
  techRecord_coifDate: new Date().toISOString(),
  techRecord_variantNumber: 'variant123456',
  techRecord_variantVersionNumber: 'variantversion123456',

  techRecord_applicantDetails_name: 'Test',
  techRecord_applicantDetails_address1: 'address1',
  techRecord_applicantDetails_address2: 'address2',
  techRecord_applicantDetails_postTown: 'town',
  techRecord_applicantDetails_address3: 'address3',
  techRecord_applicantDetails_postCode: 'postCode',
  techRecord_applicantDetails_telephoneNumber: '0121',
  techRecord_applicantDetails_emailAddress: 'test@email.com',

  techRecord_microfilm_microfilmDocumentType: 'AAT - Trailer Annual Test',
  techRecord_microfilm_microfilmRollNumber: 'nb123456',
  techRecord_microfilm_microfilmSerialNumber: 'ser123456',
  techRecord_remarks: 'Some notes about the vehicle',
  techRecord_dispensations: 'reason given',
  techRecord_reasonForCreation: 'Brake Failure',
  techRecord_modelLiteral: 'Vehicle model',
  techRecord_chassisMake: 'Chassis make',
  techRecord_chassisModel: 'Chassis model',
  techRecord_bodyMake: 'Body make',
  techRecord_bodyModel: 'Body model',
  techRecord_bodyType_description: BodyTypeDescription.DOUBLE_DECKER,
  techRecord_functionCode: 'r',
  techRecord_conversionRefNo: '345345',

  // Gross vehicle weights
  techRecord_grossKerbWeight: 1,
  techRecord_grossLadenWeight: 2,
  techRecord_grossGbWeight: 3,

  techRecord_grossDesignWeight: 5,
  techRecord_unladenWeight: 6,

  // Train weights
  techRecord_maxTrainGbWeight: 7,
  techRecord_trainDesignWeight: 8,
  techRecord_dda_certificateIssued: true,
  techRecord_dda_wheelchairCapacity: 5,
  techRecord_dda_wheelchairFittings: 'data',
  techRecord_dda_wheelchairLiftPresent: false,
  techRecord_dda_wheelchairLiftInformation: 'more data',
  techRecord_dda_wheelchairRampPresent: true,
  techRecord_dda_wheelchairRampInformation: 'ramp data',
  techRecord_dda_minEmergencyExits: 3,
  techRecord_dda_outswing: 'Anderson',
  techRecord_dda_ddaSchedules: 'dda',
  techRecord_dda_seatbeltsFitted: 51,
  techRecord_dda_ddaNotes: 'This is a note',
  techRecord_axles: [
    {
      axleNumber: 1,
      tyres_tyreSize: '295/80-22.5',
      tyres_speedCategorySymbol: 'p',
      tyres_fitmentCode: 'double',
      tyres_dataTrAxles: 0,
      tyres_plyRating: 'A',
      tyres_tyreCode: 456,
      parkingBrakeMrk: false,

      weights_kerbWeight: 1,
      weights_ladenWeight: 2,
      weights_gbWeight: 3,
      weights_designWeight: 5
    },
    {
      axleNumber: 2,
      parkingBrakeMrk: true,

      tyres_tyreSize: '295/80-22.5',
      tyres_speedCategorySymbol: 'p',
      tyres_fitmentCode: 'double',
      tyres_dataTrAxles: 0,
      tyres_plyRating: 'A',
      tyres_tyreCode: 456,

      weights_kerbWeight: 1,
      weights_ladenWeight: 2,
      weights_gbWeight: 3,
      weights_designWeight: 5
    },
    {
      axleNumber: 3,
      parkingBrakeMrk: true,

      tyres_tyreSize: '295/80-22.5',
      tyres_speedCategorySymbol: 'p',
      tyres_fitmentCode: 'double',
      tyres_dataTrAxles: 0,
      tyres_plyRating: 'A',
      tyres_tyreCode: 456,

      weights_kerbWeight: 1,
      weights_ladenWeight: 2,
      weights_gbWeight: 3,
      weights_designWeight: 5
    }
  ]
});

[
  {
    axleNumber: 1,
    tyres_tyreSize: '295/80-22.5',
    tyres_speedCategorySymbol: 'p',
    tyres_fitmentCode: 'double',
    tyres_dataTrAxles: 0,
    tyres_plyRating: 'A',
    tyres_tyreCode: 456,
    parkingBrakeMrk: false,

    weights_kerbWeight: 1,
    weights_ladenWeight: 2,
    weights_gbWeight: 3,
    // TODO: V3 2 eecweights in type package, which is this?
    // weights_eecWeight: 4,
    weights_designWeight: 5
  },
  {
    axleNumber: 2,
    parkingBrakeMrk: true,

    tyres_tyreSize: '295/80-22.5',
    tyres_speedCategorySymbol: 'p',
    tyres_fitmentCode: 'double',
    tyres_dataTrAxles: 0,
    tyres_plyRating: 'A',
    tyres_tyreCode: 456,

    weights_kerbWeight: 1,
    weights_ladenWeight: 2,
    weights_gbWeight: 3,
    // weights_eecWeight: 4,
    weights_designWeight: 5
  },
  {
    axleNumber: 3,
    parkingBrakeMrk: true,

    tyres_tyreSize: '295/80-22.5',
    tyres_speedCategorySymbol: 'p',
    tyres_fitmentCode: 'double',
    tyres_dataTrAxles: 0,
    tyres_plyRating: 'A',
    tyres_tyreCode: 456,

    weights_kerbWeight: 1,
    weights_ladenWeight: 2,
    weights_gbWeight: 3,
    // weights_eecWeight: 4,
    weights_designWeight: 5
  }
];
