import { VehicleTechRecordModel, VehicleSizes, EuVehicleCategories, FrameDescriptions, VehicleConfigurations, FuelTypes, VehicleTypes} from '@models/vehicle-tech-record.model';
import { createMock, createMockList } from 'ts-auto-mock';

export const mockVehicleTecnicalRecord = (systemNumber: number = 0) =>
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
    techRecord: [{
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
      departmentalVehicleMaker: true,
    }]
  });

export const mockVehicleTecnicalRecordList = (items: number = 1) => createMockList<VehicleTechRecordModel>(items, (systemNumber) => mockVehicleTecnicalRecord(systemNumber));
