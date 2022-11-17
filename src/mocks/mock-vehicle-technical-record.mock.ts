import { VehicleTechRecordModel, VehicleTypes } from '../app/models/vehicle-tech-record.model';
import { createMockList } from 'ts-auto-mock';
import { createMockPsv } from './psv-record.mock';
import { createMockHgv } from './hgv-record.mock';
import { createMockTrl } from './trl-record.mock';

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

export const mockVehicleTechnicalRecordList = (vehicleType: VehicleTypes = VehicleTypes.PSV, items: number = 1) =>
  createMockList<VehicleTechRecordModel>(items, systemNumber => mockVehicleTechnicalRecord(vehicleType, systemNumber));
