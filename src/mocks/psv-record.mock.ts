import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalTypeHgvOrPsv.enum.js';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescriptionPSV.enum.js';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { BodyTypeDescription } from '@models/body-type-enum';
import { FuelTypes, Retarders, StatusCodes, VehicleConfigurations, VehicleSizes } from '../app/models/vehicle-tech-record.model';

export const createMockPsv = (systemNumber: number): TechRecordType<'psv'> => ({
  systemNumber: 'PSV',
  vin: `XMGDE02FS0H0${12344 + systemNumber + 1}`,
  primaryVrm: 'KP01ABC',
  secondaryVrms: undefined,
  createdTimestamp: 'now',
  techRecord_createdAt: new Date().toISOString(),
  techRecord_createdByName: 'Nathan',
  techRecord_statusCode: StatusCodes.PROVISIONAL,
  techRecord_vehicleType: 'psv',
  techRecord_regnDate: '1234',
  techRecord_manufactureYear: 2022,
  techRecord_axles: axles as unknown as PSVAxles[],
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

  techRecord_vehicleClass_description: VehicleClassDescription.LARGE_PSV,
  techRecord_vehicleClass_code: '1',
  techRecord_vehicleConfiguration: VehicleConfigurations.ARTICULATED,
  techRecord_euVehicleCategory: EUVehicleCategory.M1,
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
  techRecord_approvalType: ApprovalType.ECSSTA,
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

  // techRecord_microfilmDocumentType: 'AAT - Trailer Annual Test',
  // techRecord_microfilmRollNumber: 'nb123456',
  // techRecord_microfilmSerialNumber: 'ser123456',
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
  // TODO: missing from types package
  // techRecord_grossEecWeight: 4,
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
});

const axles = [
  {
    axleNumber: 1,
    tyres_tyreSize: '295/80-22.5',
    tyres_speedCategorySymbol: 'p',
    tyres_fitmentCode: 'double',
    tyres_dataTrAxles: 0,
    tyres_plyRating: 'A',
    tyres_tyreCode: 456,
    parkingBrakeMrk: 'false',

    weights_kerbWeight: 1,
    weights_ladenWeight: 2,
    weights_gbWeight: 3,
    // TODO: V3 2 eecweights in type package, which is this?
    // weights_eecWeight: 4,
    weights_designWeight: 5,
  },
  {
    axleNumber: 2,
    parkingBrakeMrk: 'true',

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
    weights_designWeight: 5,
  },
  {
    axleNumber: 3,
    parkingBrakeMrk: 'true',

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
    weights_designWeight: 5,
  },
];

// const provisionalTechRecord = {
//   createdAt: new Date(),
//   createdByName: 'Nathan',
//   statusCode: StatusCodes.PROVISIONAL,
//   vehicleType: VehicleTypes.PSV,
//   regnDate: '1234',
//   manufactureYear: 2022,
//   noOfAxles: 2,
//   brakes: {
//     dtpNumber: '1234',
//     brakeCode: '1234',
//     dataTrBrakeOne: '12',
//     dataTrBrakeTwo: '34',
//     dataTrBrakeThree: '56',
//     retarderBrakeOne: Retarders.ELECTRIC,
//     retarderBrakeTwo: Retarders.ELECTRIC,
//     brakeForceWheelsNotLocked: {
//       parkingBrakeForceA: 1234,
//       secondaryBrakeForceA: 1234,
//       serviceBrakeForceA: 1234
//     },
//     brakeForceWheelsUpToHalfLocked: {
//       parkingBrakeForceB: 1234,
//       secondaryBrakeForceB: 1234,
//       serviceBrakeForceB: 1234
//     }
//   },
//   axles: [
//     {
//       axleNumber: 1,
//       tyres: {
//         tyreSize: '295/80-22.5',
//         speedCategorySymbol: SpeedCategorySymbol.P,
//         fitmentCode: FitmentCode.DOUBLE,
//         dataTrAxles: 0,
//         plyRating: 'A',
//         tyreCode: 456
//       },
//       parkingBrakeMrk: false,
//       weights: {
//         kerbWeight: 1,
//         ladenWeight: 2,
//         gbWeight: 3,
//         eecWeight: 4,
//         designWeight: 5
//       }
//     },
//     {
//       axleNumber: 2,
//       parkingBrakeMrk: true,
//       tyres: {
//         tyreSize: '295/80-22.5',
//         speedCategorySymbol: SpeedCategorySymbol.P,
//         fitmentCode: FitmentCode.DOUBLE,
//         dataTrAxles: 0,
//         plyRating: 'A',
//         tyreCode: 456
//       },
//       weights: {
//         kerbWeight: 1,
//         ladenWeight: 2,
//         gbWeight: 3,
//         eecWeight: 4,
//         designWeight: 5
//       }
//     },
//     {
//       axleNumber: 3,
//       parkingBrakeMrk: true,
//       tyres: {
//         tyreSize: '295/80-22.5',
//         speedCategorySymbol: SpeedCategorySymbol.P,
//         fitmentCode: FitmentCode.DOUBLE,
//         dataTrAxles: 0,
//         plyRating: 'A',
//         tyreCode: 456
//       },
//       weights: {
//         kerbWeight: 1,
//         ladenWeight: 2,
//         gbWeight: 3,
//         eecWeight: 4,
//         designWeight: 5
//       }
//     }
//   ],
//   speedLimiterMrk: true,
//   speedRestriction: 54,
//   tachoExemptMrk: true,
//   euroStandard: '123',
//   fuelPropulsionSystem: FuelTypes.HYBRID,
//   vehicleClass: {
//     description: 'Description',
//     code: '1'
//   },
//   vehicleConfiguration: VehicleConfigurations.ARTICULATED,
//   euVehicleCategory: EuVehicleCategories.M1,
//   emissionsLimit: 1234,
//   seatsLowerDeck: 1234,
//   seatsUpperDeck: 1234,
//   standingCapacity: 1234,
//   vehicleSize: VehicleSizes.SMALL,
//   numberOfSeatbelts: '1234',
//   seatbeltInstallationApprovalDate: '1234',
//   departmentalVehicleMarker: true,
//   dimensions: {
//     height: 30000,
//     length: 25000,
//     width: 10000
//   },
//   frontAxleToRearAxle: 5000,
//   approvalType: approvalType.ECSSTA,
//   approvalTypeNumber: 'approval123',
//   ntaNumber: 'nta789',
//   coifSerialNumber: 'coifSerial123456',
//   coifCertifierName: 'coifName',
//   coifDate: new Date(),
//   variantNumber: 'variant123456',
//   variantVersionNumber: 'variantversion123456',
//   applicantDetails: {
//     name: 'Test',
//     address1: 'address1',
//     address2: 'address2',
//     postTown: 'town',
//     address3: 'address3',
//     postCode: 'postCode',
//     telephoneNumber: '0121',
//     emailAddress: 'test@email.com'
//   },
//   microfilm: {
//     microfilmDocumentType: MicrofilmDocumentType.AAT,
//     microfilmRollNumber: 'nb123456',
//     microfilmSerialNumber: 'ser123456'
//   },
//   remarks: 'Some notes about the vehicle',
//   dispensations: 'reason given',
//   reasonForCreation: 'Brake Failure',
//   modelLiteral: 'Vehicle model',
//   chassisMake: 'Chassis make',
//   chassisModel: 'Chassis model',
//   bodyMake: 'Body make',
//   bodyModel: 'Body model',
//   bodyType: {
//     description: BodyTypeDescription.DOUBLE_DECKER
//   },
//   functionCode: 'r',
//   conversionRefNo: '345345',

//   // Gross vehicle weights
//   grossKerbWeight: 1,
//   grossLadenWeight: 2,
//   grossGbWeight: 3,
//   grossEecWeight: 4,
//   grossDesignWeight: 5,
//   unladenWeight: 6,

//   // Train weights
//   maxTrainGbWeight: 7,
//   trainDesignWeight: 8,
//   dda: {
//     certificateIssued: true,
//     wheelchairCapacity: 5,
//     wheelchairFittings: 'data',
//     wheelchairLiftPresent: false,
//     wheelchairLiftInformation: 'more data',
//     wheelchairRampPresent: true,
//     wheelchairRampInformation: 'ramp data',
//     minEmergencyExits: 3,
//     outswing: 'Anderson',
//     ddaSchedules: 'dda',
//     seatbeltsFitted: 51,
//     ddaNotes: 'This is a note'
//   }
// };

// const archivedTechRecord = {
//   createdAt: new Date(2018, 11),
//   createdByName: 'Nathan',
//   statusCode: StatusCodes.ARCHIVED,
//   vehicleType: VehicleTypes.PSV,
//   regnDate: '12345678',
//   manufactureYear: 2022,
//   noOfAxles: 2,
//   brakes: {
//     dtpNumber: '12345678',
//     brakeCode: '1234',
//     dataTrBrakeOne: '12',
//     dataTrBrakeTwo: '34',
//     dataTrBrakeThree: '56',
//     retarderBrakeOne: Retarders.ELECTRIC,
//     retarderBrakeTwo: Retarders.ELECTRIC,
//     brakeForceWheelsNotLocked: {
//       parkingBrakeForceA: 1234,
//       secondaryBrakeForceA: 1234,
//       serviceBrakeForceA: 1234
//     },
//     brakeForceWheelsUpToHalfLocked: {
//       parkingBrakeForceB: 1234,
//       secondaryBrakeForceB: 1234,
//       serviceBrakeForceB: 1234
//     }
//   },
//   axles: [
//     {
//       axleNumber: 1,
//       parkingBrakeMrk: false,
//       weights: {
//         kerbWeight: 1,
//         ladenWeight: 2,
//         gbWeight: 3,
//         eecWeight: 4,
//         designWeight: 5
//       }
//     },
//     {
//       axleNumber: 2,
//       parkingBrakeMrk: true,
//       weights: {
//         kerbWeight: 1,
//         ladenWeight: 2,
//         gbWeight: 3,
//         eecWeight: 4,
//         designWeight: 5
//       }
//     }
//   ],
//   speedLimiterMrk: true,
//   tachoExemptMrk: true,
//   euroStandard: '123',
//   fuelPropulsionSystem: FuelTypes.HYBRID,
//   vehicleClass: {
//     description: 'Description',
//     code: '2'
//   },
//   vehicleConfiguration: VehicleConfigurations.ARTICULATED,
//   euVehicleCategory: EuVehicleCategories.M1,
//   emissionsLimit: 1234,
//   seatsLowerDeck: 1234,
//   seatsUpperDeck: 1234,
//   standingCapacity: 1234,
//   vehicleSize: VehicleSizes.SMALL,
//   numberOfSeatbelts: '1234',
//   seatbeltInstallationApprovalDate: '1234',
//   departmentalVehicleMarker: true,
//   dimensions: {
//     height: 30000,
//     length: 25000,
//     width: 10000
//   },
//   frontAxleToRearAxle: 5000,
//   approvalType: approvalType.ECSSTA,
//   approvalTypeNumber: 'approval123',
//   ntaNumber: 'nta789',
//   coifSerialNumber: 'coifSerial123456',
//   coifCertifierName: 'coifName',
//   coifDate: new Date(),
//   variantNumber: 'variant123456',
//   variantVersionNumber: 'variantversion123456',
//   applicantDetails: {
//     name: 'Test',
//     address1: 'address1',
//     address2: 'address2',
//     postTown: 'town',
//     address3: 'address3',
//     postCode: 'postCode',
//     telephoneNumber: '0121',
//     emailAddress: 'test@email.com'
//   },
//   microfilm: {
//     microfilmDocumentType: MicrofilmDocumentType.AAT,
//     microfilmRollNumber: 'nb123456',
//     microfilmSerialNumber: 'ser123456'
//   },
//   remarks: 'Some notes about the vehicle',
//   dispensations: 'reason given',
//   reasonForCreation: 'COIF',
//   modelLiteral: 'Vehicle model',
//   chassisMake: 'Chassis make',
//   chassisModel: 'Chassis model',
//   bodyMake: 'Body make',
//   bodyModel: 'Body model',
//   bodyType: {
//     description: BodyTypeDescription.DOUBLE_DECKER
//   },
//   functionCode: 'r',
//   conversionRefNo: '345345',

//   // Gross vehicle weights
//   grossKerbWeight: 1,
//   grossLadenWeight: 2,
//   grossGbWeight: 3,
//   grossEecWeight: 4,
//   grossDesignWeight: 5,
//   unladenWeight: 6,

//   // Train weights
//   maxTrainGbWeight: 7,
//   trainDesignWeight: 8
// };

// const currentTechRecord = {
//   recordCompleteness: 'complete',
//   createdAt: new Date(2019, 11),
//   createdByName: 'Nathan',
//   statusCode: StatusCodes.CURRENT,
//   vehicleType: VehicleTypes.PSV,
//   regnDate: '12345678',
//   manufactureYear: 2022,
//   noOfAxles: 2,
//   brakes: {
//     dtpNumber: '987654321',
//     brakeCode: '1234',
//     dataTrBrakeOne: '12',
//     dataTrBrakeTwo: '34',
//     dataTrBrakeThree: '56',
//     retarderBrakeOne: Retarders.ELECTRIC,
//     retarderBrakeTwo: Retarders.ELECTRIC,
//     brakeForceWheelsNotLocked: {
//       parkingBrakeForceA: 1234,
//       secondaryBrakeForceA: 1234,
//       serviceBrakeForceA: 1234
//     },
//     brakeForceWheelsUpToHalfLocked: {
//       parkingBrakeForceB: 1234,
//       secondaryBrakeForceB: 1234,
//       serviceBrakeForceB: 1234
//     }
//   },
//   axles: [
//     {
//       axleNumber: 1,
//       parkingBrakeMrk: false,
//       weights: {
//         kerbWeight: 1,
//         ladenWeight: 2,
//         gbWeight: 3,
//         eecWeight: 4,
//         designWeight: 5
//       }
//     },
//     {
//       axleNumber: 2,
//       parkingBrakeMrk: true,
//       weights: {
//         kerbWeight: 1,
//         ladenWeight: 2,
//         gbWeight: 3,
//         eecWeight: 4,
//         designWeight: 5
//       }
//     }
//   ],
//   speedLimiterMrk: true,
//   tachoExemptMrk: true,
//   euroStandard: '123',
//   fuelPropulsionSystem: FuelTypes.HYBRID,
//   vehicleClass: {
//     description: 'Description',
//     code: '3'
//   },
//   vehicleConfiguration: VehicleConfigurations.ARTICULATED,
//   euVehicleCategory: EuVehicleCategories.M1,
//   emissionsLimit: 1234,
//   seatsLowerDeck: 1234,
//   seatsUpperDeck: 1234,
//   standingCapacity: 1234,
//   vehicleSize: VehicleSizes.SMALL,
//   numberOfSeatbelts: '1234',
//   seatbeltInstallationApprovalDate: '1234',
//   departmentalVehicleMarker: true,
//   dimensions: {
//     height: 30000,
//     length: 25000,
//     width: 10000
//   },
//   frontAxleToRearAxle: 5000,
//   approvalType: approvalType.ECSSTA,
//   approvalTypeNumber: 'approval123',
//   ntaNumber: 'nta789',
//   coifSerialNumber: 'coifSerial123456',
//   coifCertifierName: 'coifName',
//   coifDate: '1233-12-31',
//   variantNumber: 'variant123456',
//   variantVersionNumber: 'variantversion123456',
//   applicantDetails: {
//     name: 'Test',
//     address1: 'address1',
//     address2: 'address2',
//     postTown: 'town',
//     address3: 'address3',
//     postCode: 'postCode',
//     telephoneNumber: '0121',
//     emailAddress: 'test@email.com'
//   },
//   microfilm: {
//     microfilmDocumentType: MicrofilmDocumentType.AAT,
//     microfilmRollNumber: 'nb123456',
//     microfilmSerialNumber: 'ser123456'
//   },
//   remarks: 'Some notes about the vehicle',
//   dispensations: 'reason given',
//   reasonForCreation: 'COIF',
//   modelLiteral: 'Vehicle model',
//   chassisMake: 'Chassis make',
//   chassisModel: 'Chassis model',
//   bodyMake: 'Body make',
//   bodyModel: 'Body model',
//   bodyType: {
//     description: BodyTypeDescription.DOUBLE_DECKER
//   },
//   functionCode: 'r',
//   conversionRefNo: '345345',

//   // Gross vehicle weights
//   grossKerbWeight: 1,
//   grossLadenWeight: 2,
//   grossGbWeight: 3,
//   grossEecWeight: 4,
//   grossDesignWeight: 5,
//   unladenWeight: 6,

//   // Train weights
//   maxTrainGbWeight: 7,
//   trainDesignWeight: 8
// };

// original axles

// [{
//   axleNumber: 1,
//   tyres_tyreSize: '295/80-22.5',
//   tyres_speedCategorySymbol: 'p',
//   tyres_fitmentCode: 'double',
//   tyres_dataTrAxles: 0,
//   tyres_plyRating: 'A',
//   tyres_tyreCode: 456,
//   parkingBrakeMrk: false,

//   weights_kerbWeight: 1,
//   weights_ladenWeight: 2,
//   weights_gbWeight: 3,
//   // TODO: V3 2 eecweights in type package, which is this?
//   // weights_eecWeight: 4,
//   weights_designWeight: 5,
// },
// {
//   axleNumber: 2,
//   parkingBrakeMrk: true,

//   tyres_tyreSize: '295/80-22.5',
//   tyres_speedCategorySymbol: 'p',
//   tyres_fitmentCode: 'double',
//   tyres_dataTrAxles: 0,
//   tyres_plyRating: 'A',
//   tyres_tyreCode: 456,

//   weights_kerbWeight: 1,
//   weights_ladenWeight: 2,
//   weights_gbWeight: 3,
//   // weights_eecWeight: 4,
//   weights_designWeight: 5

// },
// {
//   axleNumber: 3,
//   parkingBrakeMrk: true,

//   tyres_tyreSize: '295/80-22.5',
//   tyres_speedCategorySymbol: 'p',
//   tyres_fitmentCode: 'double',
//   tyres_dataTrAxles: 0,
//   tyres_plyRating: 'A',
//   tyres_tyreCode: 456,

//   weights_kerbWeight: 1,
//   weights_ladenWeight: 2,
//   weights_gbWeight: 3,
//   // weights_eecWeight: 4,
//   weights_designWeight: 5

// }
// ]
