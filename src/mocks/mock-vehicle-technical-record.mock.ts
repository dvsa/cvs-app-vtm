import { VehicleTechRecordModel, VehicleSizes, EuVehicleCategories, FrameDescriptions, VehicleConfigurations, FuelTypes, VehicleTypes, StatusCodes} from '../app/models/vehicle-tech-record.model';
import { createMock, createMockList } from 'ts-auto-mock';

export const mockVehicleTechnicalRecord = (vehicleType: VehicleTypes = VehicleTypes.PSV, systemNumber: number = 0) => {
  switch (vehicleType) {
    case VehicleTypes.HGV:
      return createMockHgv(systemNumber);
    case VehicleTypes.TRL:
      return createMockTrl(systemNumber);
    default:
      return createMockPsv(systemNumber);
  };
};

const createMockPsv = (systemNumber: number): VehicleTechRecordModel => 
  createMock<VehicleTechRecordModel>({
    systemNumber: `SYS${String(systemNumber + 1).padStart(4, '0')}`,
    vin: `XMGDE02FS0H0${12344 + systemNumber + 1}`,

    primaryVrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
    secondaryVrms: [
      '609859Z',
      '609959Z'
    ],
    techRecord: [{
      statusCode: StatusCodes.CURRENT,
      vehicleType: VehicleTypes.PSV,
      regnDate: "1234",
      manufactureYear: 2022,
      noOfAxles: 2,
      dtpNumber: "1234",
      axles: {
        parkingBrakeMrk: true
      },
      speedLimiterMrk: true,
      tachoExemptMrk: true,
      euroStandard: "123",
      fuelpropulsionsystem: FuelTypes.HYBRID,
      vehicleClass: {
        description: "Description",
      },
      vehicleConfiguration: VehicleConfigurations.ARTICULATED,
      euVehicleCategory: EuVehicleCategories.M1,
      emissionsLimit: 1234,
      seatsLowerDeck: 1234,
      seatsUpperDeck: 1234,
      standingCapacity: 1234,
      vehicleSize: VehicleSizes.SMALL,
      numberOfSeatbelts: "1234",
      seatbeltInstallationApprovalDate: "1234",
      departmentalVehicleMarker: true,
    }]
  });

  const createMockHgv = (systemNumber: number): VehicleTechRecordModel => 
  createMock<VehicleTechRecordModel>({
    systemNumber: `SYS${String(systemNumber + 1).padStart(4, '0')}`,
    vin: `XMGDE02FS0H0${12344 + systemNumber + 1}`,

    primaryVrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
    secondaryVrms: [
      {
        vrm: '609859Z',
      }
    ],
    techRecord: [{
      statusCode: StatusCodes.CURRENT,
      vehicleType: VehicleTypes.HGV,
      regnDate: "1234",
      manufactureYear: 2022,
      noOfAxles: 2,
      dtpNumber: "1234",
      axles: {
        parkingBrakeMrk: true
      },
      speedLimiterMrk: true,
      tachoExemptMrk: true,
      euroStandard: "123",
      roadFriendly: true,
      fuelpropulsionsystem: FuelTypes.HYBRID,
      drawbarCouplingFitted: true,
      vehicleClass: {
        description: "Description",
      },
      vehicleConfiguration: VehicleConfigurations.ARTICULATED,
      offRoad: true,
      euVehicleCategory: EuVehicleCategories.M1,
      emissionsLimit: 1234,
      departmentalVehicleMarker: true,
    }]
  });

  const createMockTrl = (systemNumber: number): VehicleTechRecordModel => 
  createMock<VehicleTechRecordModel>({
    systemNumber: `SYS${String(systemNumber + 1).padStart(4, '0')}`,
    vin: `XMGDE02FS0H0${12344 + systemNumber + 1}`,

    primaryVrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
    secondaryVrms: [
      {
        vrm: '609859Z',
      }
    ],
    techRecord: [{
      statusCode: StatusCodes.CURRENT,
      vehicleType: VehicleTypes.TRL,
      regnDate: "1234",
      firstUseDate: "1234",
      manufactureYear: 2022,
      noOfAxles: 2,
      dtpNumber: "1234",
      axles: {
        parkingBrakeMrk: true
      },
      suspensionType: "1",
      roadFriendly: true,
      drawbarCouplingFitted: true,
      vehicleClass: {
        description: "Description",
      },
      vehicleConfiguration: VehicleConfigurations.ARTICULATED,
      couplingType: "1",
      maxLoadOnCoupling: 1234,
      frameDescription: FrameDescriptions.FRAME_SECTION,
      euVehicleCategory: EuVehicleCategories.M1,
      departmentalVehicleMarker: true,
    }]
  });


export const mockVehicleTechnicalRecordList = (vehicleType: VehicleTypes = VehicleTypes.PSV, items: number = 1) => createMockList<VehicleTechRecordModel>(items, (systemNumber) => mockVehicleTechnicalRecord(vehicleType, systemNumber));
