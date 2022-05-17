import { VehicleTechRecordModel, VehicleSizes, EuVehicleCategories, FrameDescriptions, VehicleConfigurations, FuelTypes, VehicleTypes, StatusCodes, RetarderBrake } from '../app/models/vehicle-tech-record.model';
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
        statusCode: StatusCodes.CURRENT,
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
            parkingBrakeMrk: false
          },
          {
            axleNumber: 2,
            parkingBrakeMrk: true
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
        departmentalVehicleMarker: true
      }
    ]
  });

const createMockHgv = (systemNumber: number): VehicleTechRecordModel =>
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
      }
    ],
    techRecord: [
      {
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
        departmentalVehicleMarker: true
      }
    ]
  });

const createMockTrl = (systemNumber: number): VehicleTechRecordModel =>
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
      }
    ],
    techRecord: [
      {
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
        departmentalVehicleMarker: true
      }
    ]
  });

export const mockVehicleTechnicalRecordList = (vehicleType: VehicleTypes = VehicleTypes.PSV, items: number = 1) => createMockList<VehicleTechRecordModel>(items, (systemNumber) => mockVehicleTechnicalRecord(vehicleType, systemNumber));
