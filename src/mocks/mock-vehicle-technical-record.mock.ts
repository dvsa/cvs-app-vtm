import { VehicleTechRecordModel, VehicleSizes, EuVehicleCategories, FrameDescriptions, VehicleConfigurations, FuelTypes, VehicleTypes, StatusCodes} from '../app/models/vehicle-tech-record.model';
import { createMock, createMockList } from 'ts-auto-mock';

export const mockVehicleTechnicalRecord = (systemNumber: number = 0) =>
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

export const mockVehicleTechnicalRecordList = (items: number = 1) => createMockList<VehicleTechRecordModel>(items, (systemNumber) => mockVehicleTechnicalRecord(systemNumber));
