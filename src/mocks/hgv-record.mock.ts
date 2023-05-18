import {
  VehicleTechRecordModel,
  StatusCodes,
  VehicleTypes,
  FuelTypes,
  VehicleConfigurations,
  EuVehicleCategories,
  approvalType,
  PlateReasonForIssue
} from '../app/models/vehicle-tech-record.model';
import { createMock } from 'ts-auto-mock';
import { BodyTypeDescription } from '@models/body-type-enum';

export const createMockHgv = (systemNumber: number): VehicleTechRecordModel =>
  createMock<VehicleTechRecordModel>({
    systemNumber: `HGV`,
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
    techRecord: [currentTechRecord]
  });

const currentTechRecord = {
  createdAt: new Date(),
  createdByName: 'Nathan',
  statusCode: StatusCodes.CURRENT,
  vehicleType: VehicleTypes.HGV,
  regnDate: '1234',
  manufactureYear: 2022,
  noOfAxles: 2,
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
    description: 'Description',
    code: '1'
  },
  vehicleConfiguration: VehicleConfigurations.ARTICULATED,
  offRoad: true,
  euVehicleCategory: EuVehicleCategories.M1,
  emissionsLimit: 1234,
  departmentalVehicleMarker: true,
  reasonForCreation: 'Brake Failure',
  approvalType: approvalType.ECSSTA,
  approvalTypeNumber: 'approval123',
  ntaNumber: 'nta789',
  variantNumber: 'variant123456',
  variantVersionNumber: 'variantversion123456',
  dimensions: {
    length: 1,
    width: 2,
    height: 6,
    axleSpacing: [
      {
        axles: '1-2',
        value: 4
      }
    ]
  },
  frontAxleToRearAxle: 3,
  frontVehicleTo5thWheelCouplingMin: 5,
  frontVehicleTo5thWheelCouplingMax: 6,
  frontAxleTo5thWheelMin: 7,
  frontAxleTo5thWheelMax: 8,
  plates: [
    {
      plateSerialNumber: '12345',
      plateIssueDate: new Date(),
      plateReasonForIssue: PlateReasonForIssue.REPLACEMENT,
      plateIssuer: 'person'
    },
    {
      plateSerialNumber: '54321',
      plateIssueDate: new Date(),
      plateReasonForIssue: PlateReasonForIssue.REPLACEMENT,
      plateIssuer: 'person 2'
    }
  ],
  make: '1234',
  model: '1234',
  bodyType: {
    description: BodyTypeDescription.OTHER
  },
  functionCode: '1',
  conversionRefNo: '1234',
  grossGbWeight: 2,
  grossEecWeight: 4,
  grossDesignWeight: 3,
  trainGbWeight: 3,
  trainEecWeight: 3,
  trainDesignWeight: 7
};
