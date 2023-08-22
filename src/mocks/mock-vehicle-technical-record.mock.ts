import { createMockPsv } from './psv-record.mock';
import { createMockHgv } from './hgv-record.mock';
import { createMockTrl } from './trl-record.mock';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';

export const mockVehicleTechnicalRecord = (vehicleType: VehicleType = "psv", systemNumber: number = 0) => {
  switch (vehicleType) {
    case "hgv":
      return createMockHgv(systemNumber);
    case "trl":
      return createMockTrl(systemNumber);
    default:
      return createMockPsv(systemNumber);
  }
};
