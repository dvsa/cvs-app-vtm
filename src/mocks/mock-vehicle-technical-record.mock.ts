import { VehicleTechRecordModel, VehicleSizes, EuVehicleCategories, FrameDescriptions, VehicleConfigurations, FuelTypes, VehicleTypes, StatusCodes, RetarderBrake, approvalType, MicrofilmDocumentType, BodyTypeDescription, FitmentCode, SpeedCategorySymbol } from '../app/models/vehicle-tech-record.model';
import { createMock, createMockList } from 'ts-auto-mock';

export const mockVehicleTechnicalRecord = (vehicleType: VehicleTypes = VehicleTypes.PSV, systemNumber: number = 0) => {
  switch (vehicleType) {
    case VehicleTypes.HGV:
      return createMockHgv(systemNumber);
    case VehicleTypes.TRL:
      return createMockTrl(systemNumber);
    default:
      return createMockPsv(systemNumber);
  }
};

const createMockPsv = (systemNumber: number): VehicleTechRecordModel =>
  createMock<VehicleTechRecordModel>({
    systemNumber: `SYS${String(systemNumber + 1).padStart(4, '0')}`,
    vin: `XMGDE02FS0H0${12344 + systemNumber + 1}`,
    vrms: [
      {
        vrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
        isPrimary: true
      },
      {
        vrm: '609859Z',
        isPrimary: false
      },
      {
        vrm: '609959Z',
        isPrimary: false
      }
    ],
    techRecord: [
      {
        createdAt: new Date(),
        createdByName: 'Nathan',
        statusCode: StatusCodes.PROVISIONAL,
        vehicleType: VehicleTypes.PSV,
        regnDate: '1234',
        manufactureYear: 2022,
        noOfAxles: 2,
        brakes: {
          dtpNumber: '1234',
          brakeCode: '1234',
          dataTrBrakeOne: '12',
          dataTrBrakeTwo: '34',
          dataTrBrakeThree: '56',
          retarderBrakeOne: RetarderBrake.ELECTRIC,
          retarderBrakeTwo: RetarderBrake.ELECTRIC,
          brakeForceWheelsNotLocked: {
            parkingBrakeForceA: 1234,
            secondaryBrakeForceA: 1234,
            serviceBrakeForceA: 1234
          },
          brakeForceWheelsUpToHalfLocked: {
            parkingBrakeForceB: 1234,
            secondaryBrakeForceB: 1234,
            serviceBrakeForceB: 1234
          }
        },
        axles: [
          {
            axleNumber: 1,
            tyres: {
              tyreSize: '295/80-22.5',
              speedCategorySymbol: SpeedCategorySymbol.P,
              fitmentCode: FitmentCode.DOUBLE,
              dataTrAxles: 0,
              plyRating: 'A',
              tyreCode: 456
            },
            parkingBrakeMrk: false,
            weights: {
              kerbWeight: 1,
              ladenWeight: 2,
              gbWeight: 3,
              eecWeight: 4,
              designWeight: 5
            }
          },
          {
            axleNumber: 2,
            parkingBrakeMrk: true,
            tyres: {
              tyreSize: '295/80-22.5',
              speedCategorySymbol: SpeedCategorySymbol.P,
              fitmentCode: FitmentCode.DOUBLE,
              dataTrAxles: 0,
              plyRating: 'A',
              tyreCode: 456
            },
            weights: {
              kerbWeight: 1,
              ladenWeight: 2,
              gbWeight: 3,
              eecWeight: 4,
              designWeight: 5
            }
          }
        ],
        speedLimiterMrk: true,
        speedRestriction: 54,
        tachoExemptMrk: true,
        euroStandard: '123',
        fuelPropulsionSystem: FuelTypes.HYBRID,
        vehicleClass: {
          description: 'Description'
        },
        vehicleConfiguration: VehicleConfigurations.ARTICULATED,
        euVehicleCategory: EuVehicleCategories.M1,
        emissionsLimit: 1234,
        seatsLowerDeck: 1234,
        seatsUpperDeck: 1234,
        standingCapacity: 1234,
        vehicleSize: VehicleSizes.SMALL,
        numberOfSeatbelts: '1234',
        seatbeltInstallationApprovalDate: '1234',
        departmentalVehicleMarker: true,
        dimensions: {
          height: 30000,
          length: 25000,
          width: 10000
        },
        frontAxleToRearAxle: 5000,
        approvalType: approvalType.ECSSTA,
        approvalTypeNumber: 'approval123',
        ntaNumber: 'nta789',
        coifSerialNumber: 'coifSerial123456',
        coifCertifierName: 'coifName',
        coifDate: new Date(),
        variantNumber: 'variant123456',
        variantVersionNumber: 'variantversion123456',
        applicantDetails: {
          name: 'Test',
          address1: 'address1',
          address2: 'address2',
          postTown: 'town',
          address3: 'address3',
          postCode: 'postCode',
          telephoneNumber: '0121',
          emailAddress: 'test@email.com'
        },
        microfilm: {
          microfilmDocumentType: MicrofilmDocumentType.AAT,
          microfilmRollNumber: 'nb123456',
          microfilmSerialNumber: 'ser123456'
        },
        remarks: 'Some notes about the vehicle',
        reasonForCreation: 'Brake Failure',
        modelLiteral: 'Vehicle model',
        chassisMake: 'Chassis make',
        chassisModel: 'Chassis model',
        bodyMake: 'Body make',
        bodyModel: 'Body model',
        bodyType: {
          description: BodyTypeDescription.DOUBLEDECKER
        },
        functionCode: 'r',
        conversionRefNo: '345345',

        // Gross vehicle weights
        grossKerbWeight: 1,
        grossLadenWeight: 2,
        grossGbWeight: 3,
        grossEecWeight: 4,
        grossDesignWeight: 5,
        unladenWeight: 6,

        // Train weights
        maxTrainGbWeight: 7,
        trainDesignWeight: 8
      },
      {
        createdAt: new Date(2018, 11),
        createdByName: 'Nathan',
        statusCode: StatusCodes.ARCHIVED,
        vehicleType: VehicleTypes.PSV,
        regnDate: '12345678',
        manufactureYear: 2022,
        noOfAxles: 2,
        brakes: {
          dtpNumber: '12345678',
          brakeCode: '1234',
          dataTrBrakeOne: '12',
          dataTrBrakeTwo: '34',
          dataTrBrakeThree: '56',
          retarderBrakeOne: RetarderBrake.ELECTRIC,
          retarderBrakeTwo: RetarderBrake.ELECTRIC,
          brakeForceWheelsNotLocked: {
            parkingBrakeForceA: 1234,
            secondaryBrakeForceA: 1234,
            serviceBrakeForceA: 1234
          },
          brakeForceWheelsUpToHalfLocked: {
            parkingBrakeForceB: 1234,
            secondaryBrakeForceB: 1234,
            serviceBrakeForceB: 1234
          }
        },
        axles: [
          {
            axleNumber: 1,
            parkingBrakeMrk: false,
            weights: {
              kerbWeight: 1,
              ladenWeight: 2,
              gbWeight: 3,
              eecWeight: 4,
              designWeight: 5
            }
          },
          {
            axleNumber: 2,
            parkingBrakeMrk: true,
            weights: {
              kerbWeight: 1,
              ladenWeight: 2,
              gbWeight: 3,
              eecWeight: 4,
              designWeight: 5
            }
          }
        ],
        speedLimiterMrk: true,
        tachoExemptMrk: true,
        euroStandard: '123',
        fuelPropulsionSystem: FuelTypes.HYBRID,
        vehicleClass: {
          description: 'Description'
        },
        vehicleConfiguration: VehicleConfigurations.ARTICULATED,
        euVehicleCategory: EuVehicleCategories.M1,
        emissionsLimit: 1234,
        seatsLowerDeck: 1234,
        seatsUpperDeck: 1234,
        standingCapacity: 1234,
        vehicleSize: VehicleSizes.SMALL,
        numberOfSeatbelts: '1234',
        seatbeltInstallationApprovalDate: '1234',
        departmentalVehicleMarker: true,
        dimensions: {
          height: 30000,
          length: 25000,
          width: 10000
        },
        frontAxleToRearAxle: 5000,
        approvalType: approvalType.ECSSTA,
        approvalTypeNumber: 'approval123',
        ntaNumber: 'nta789',
        coifSerialNumber: 'coifSerial123456',
        coifCertifierName: 'coifName',
        coifDate: new Date(),
        variantNumber: 'variant123456',
        variantVersionNumber: 'variantversion123456',
        applicantDetails: {
          name: 'Test',
          address1: 'address1',
          address2: 'address2',
          postTown: 'town',
          address3: 'address3',
          postCode: 'postCode',
          telephoneNumber: '0121',
          emailAddress: 'test@email.com'
        },
        microfilm: {
          microfilmDocumentType: MicrofilmDocumentType.AAT,
          microfilmRollNumber: 'nb123456',
          microfilmSerialNumber: 'ser123456'
        },
        remarks: 'Some notes about the vehicle',
        reasonForCreation: 'COIF',
        modelLiteral: 'Vehicle model',
        chassisMake: 'Chassis make',
        chassisModel: 'Chassis model',
        bodyMake: 'Body make',
        bodyModel: 'Body model',
        bodyType: {
          description: BodyTypeDescription.DOUBLEDECKER
        },
        functionCode: 'r',
        conversionRefNo: '345345',

        // Gross vehicle weights
        grossKerbWeight: 1,
        grossLadenWeight: 2,
        grossGbWeight: 3,
        grossEecWeight: 4,
        grossDesignWeight: 5,
        unladenWeight: 6,

        // Train weights
        maxTrainGbWeight: 7,
        trainDesignWeight: 8
      },
      {
        createdAt: new Date(2019, 11),
        createdByName: 'Nathan',
        statusCode: StatusCodes.CURRENT,
        vehicleType: VehicleTypes.PSV,
        regnDate: '12345678',
        manufactureYear: 2022,
        noOfAxles: 2,
        brakes: {
          dtpNumber: '987654321',
          brakeCode: '1234',
          dataTrBrakeOne: '12',
          dataTrBrakeTwo: '34',
          dataTrBrakeThree: '56',
          retarderBrakeOne: RetarderBrake.ELECTRIC,
          retarderBrakeTwo: RetarderBrake.ELECTRIC,
          brakeForceWheelsNotLocked: {
            parkingBrakeForceA: 1234,
            secondaryBrakeForceA: 1234,
            serviceBrakeForceA: 1234
          },
          brakeForceWheelsUpToHalfLocked: {
            parkingBrakeForceB: 1234,
            secondaryBrakeForceB: 1234,
            serviceBrakeForceB: 1234
          }
        },
        axles: [
          {
            axleNumber: 1,
            parkingBrakeMrk: false,
            weights: {
              kerbWeight: 1,
              ladenWeight: 2,
              gbWeight: 3,
              eecWeight: 4,
              designWeight: 5
            }
          },
          {
            axleNumber: 2,
            parkingBrakeMrk: true,
            weights: {
              kerbWeight: 1,
              ladenWeight: 2,
              gbWeight: 3,
              eecWeight: 4,
              designWeight: 5
            }
          }
        ],
        speedLimiterMrk: true,
        tachoExemptMrk: true,
        euroStandard: '123',
        fuelPropulsionSystem: FuelTypes.HYBRID,
        vehicleClass: {
          description: 'Description'
        },
        vehicleConfiguration: VehicleConfigurations.ARTICULATED,
        euVehicleCategory: EuVehicleCategories.M1,
        emissionsLimit: 1234,
        seatsLowerDeck: 1234,
        seatsUpperDeck: 1234,
        standingCapacity: 1234,
        vehicleSize: VehicleSizes.SMALL,
        numberOfSeatbelts: '1234',
        seatbeltInstallationApprovalDate: '1234',
        departmentalVehicleMarker: true,
        dimensions: {
          height: 30000,
          length: 25000,
          width: 10000
        },
        frontAxleToRearAxle: 5000,
        approvalType: approvalType.ECSSTA,
        approvalTypeNumber: 'approval123',
        ntaNumber: 'nta789',
        coifSerialNumber: 'coifSerial123456',
        coifCertifierName: 'coifName',
        coifDate: new Date(),
        variantNumber: 'variant123456',
        variantVersionNumber: 'variantversion123456',
        applicantDetails: {
          name: 'Test',
          address1: 'address1',
          address2: 'address2',
          postTown: 'town',
          address3: 'address3',
          postCode: 'postCode',
          telephoneNumber: '0121',
          emailAddress: 'test@email.com'
        },
        microfilm: {
          microfilmDocumentType: MicrofilmDocumentType.AAT,
          microfilmRollNumber: 'nb123456',
          microfilmSerialNumber: 'ser123456'
        },
        remarks: 'Some notes about the vehicle',
        reasonForCreation: 'COIF',
        modelLiteral: 'Vehicle model',
        chassisMake: 'Chassis make',
        chassisModel: 'Chassis model',
        bodyMake: 'Body make',
        bodyModel: 'Body model',
        bodyType: {
          description: BodyTypeDescription.DOUBLEDECKER
        },
        functionCode: 'r',
        conversionRefNo: '345345',

        // Gross vehicle weights
        grossKerbWeight: 1,
        grossLadenWeight: 2,
        grossGbWeight: 3,
        grossEecWeight: 4,
        grossDesignWeight: 5,
        unladenWeight: 6,

        // Train weights
        maxTrainGbWeight: 7,
        trainDesignWeight: 8
      }
    ]
  });

const createMockHgv = (systemNumber: number): VehicleTechRecordModel =>
  createMock<VehicleTechRecordModel>({
    systemNumber: `HGV${String(systemNumber + 1).padStart(4, '0')}`,
    vin: `XMGDE03FS0H0${12344 + systemNumber + 1}`,
    vrms: [
      {
        vrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
        isPrimary: true
      },
      {
        vrm: '609859Z',
        isPrimary: false
      }
    ],
    techRecord: [
      {
        createdAt: new Date(),
        createdByName: 'Nathan',
        statusCode: StatusCodes.CURRENT,
        vehicleType: VehicleTypes.HGV,
        regnDate: '1234',
        manufactureYear: 2022,
        noOfAxles: 2,
        axles: [
          {
            parkingBrakeMrk: false
          },
          {
            parkingBrakeMrk: true
          }
        ],
        brakes: {
          dtpNumber: '1234'
        },
        speedLimiterMrk: true,
        tachoExemptMrk: true,
        euroStandard: '123',
        roadFriendly: true,
        fuelPropulsionSystem: FuelTypes.HYBRID,
        drawbarCouplingFitted: true,
        vehicleClass: {
          description: 'Description'
        },
        vehicleConfiguration: VehicleConfigurations.ARTICULATED,
        offRoad: true,
        euVehicleCategory: EuVehicleCategories.M1,
        emissionsLimit: 1234,
        departmentalVehicleMarker: true,
        reasonForCreation: 'Brake Failure',
        dimensions: {
          length: 1,
          width: 2,
          height: 6,
          axleSpacing: [{
            axles: '1-2',
            value: 4
          }]
        },
        frontAxleToRearAxle: 3,
        frontAxleTo5thWheelCouplingMin: 5,
        frontAxleTo5thWheelCouplingMax: 6,
        frontAxleTo5thWheelMin: 7,
        frontAxleTo5thWheelMax: 8,
      }
    ]
  });

const createMockTrl = (systemNumber: number): VehicleTechRecordModel =>
  createMock<VehicleTechRecordModel>({
    systemNumber: `TRL${String(systemNumber + 1).padStart(4, '0')}`,
    vin: `XMGDE04FS0H0${12344 + systemNumber + 1}`,
    vrms: [
      {
        vrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
        isPrimary: true
      },
      {
        vrm: '609859Z',
        isPrimary: false
      }
    ],
    techRecord: [
      {
        createdAt: new Date(),
        createdByName: 'Nathan',
        statusCode: StatusCodes.CURRENT,
        vehicleType: VehicleTypes.TRL,
        regnDate: '1234',
        firstUseDate: '1234',
        manufactureYear: 2022,
        noOfAxles: 2,
        brakes: {
          dtpNumber: '1234'
        },
        axles: [
          {
            parkingBrakeMrk: false
          },
          {
            parkingBrakeMrk: true
          }
        ],
        suspensionType: '1',
        roadFriendly: true,
        drawbarCouplingFitted: true,
        vehicleClass: {
          description: 'Description'
        },
        vehicleConfiguration: VehicleConfigurations.ARTICULATED,
        couplingType: '1',
        maxLoadOnCoupling: 1234,
        frameDescription: FrameDescriptions.FRAME_SECTION,
        euVehicleCategory: EuVehicleCategories.M1,
        departmentalVehicleMarker: true,
        reasonForCreation: 'Brake Failure',
        approvalType: approvalType.ECSSTA,
        approvalTypeNumber: 'approval123',
        ntaNumber: 'nta789',
        variantNumber: 'variant123456',
        variantVersionNumber: 'variantversion123456',
      }
    ]
  });

export const mockVehicleTechnicalRecordList = (vehicleType: VehicleTypes = VehicleTypes.PSV, items: number = 1) => createMockList<VehicleTechRecordModel>(items, (systemNumber) => mockVehicleTechnicalRecord(vehicleType, systemNumber));
