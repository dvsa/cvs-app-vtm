import {
  VehicleTechRecordModel,
  StatusCodes,
  VehicleTypes,
  VehicleConfigurations,
  FrameDescriptions,
  EuVehicleCategories,
  approvalType,
  PlateReasonForIssue,
  V3TechRecordModel
} from '../app/models/vehicle-tech-record.model';
import { createMock } from 'ts-auto-mock';

export const createMockTrl = (systemNumber: number): V3TechRecordModel =>
  createMock<V3TechRecordModel>({
    systemNumber: `TRL`,
    vin: `XMGDE04FS0H0${12344 + systemNumber + 1}`,
    trailerId: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
    techRecord_createdAt: new Date().toISOString(),
    techRecord_createdByName: 'Nathan',
    techRecord_statusCode: StatusCodes.CURRENT,
    techRecord_vehicleType: VehicleTypes.TRL,
    techRecord_regnDate: '1234',
    techRecord_firstUseDate: '1234',
    techRecord_manufactureYear: 2022,
    techRecord_noOfAxles: 2,
    techRecord_brakes_dtpNumber: '1234',
    techRecord_axles: undefined,
    // TODO: V3 height missing from types package
    // techRecord_dimensions_height: 30000,
    techRecord_dimensions_length: 25000,
    techRecord_dimensions_width: 10000,
    techRecord_suspensionType: '1',
    techRecord_roadFriendly: true,
    techRecord_drawbarCouplingFitted: true,

    techRecord_vehicleClass_description: 'trailer',
    techRecord_vehicleClass_code: '1',
    techRecord_vehicleConfiguration: VehicleConfigurations.ARTICULATED,
    techRecord_couplingType: '1',
    techRecord_maxLoadOnCoupling: 1234,
    techRecord_frameDescription: FrameDescriptions.FRAME_SECTION,
    techRecord_euVehicleCategory: EuVehicleCategories.M1,
    techRecord_departmentalVehicleMarker: true,
    techRecord_reasonForCreation: 'Brake Failure',
    techRecord_approvalType: approvalType.ECSSTA,
    techRecord_approvalTypeNumber: 'approval123',
    techRecord_ntaNumber: 'nta789',
    techRecord_variantNumber: 'variant123456',
    techRecord_variantVersionNumber: 'variantversion123456',
    techRecord_plates: undefined
  });
// Axels array
// [
//   {
//     parkingBrakeMrk: false
//   },
//   {
//     parkingBrakeMrk: true
//   }
// ]

// plates array:
// [
//   {
//     plateSerialNumber: '12345',
//     plateIssueDate: new Date().toISOString(),
//     reasonForIssue: 'Replacement',
//     plateIssuer: 'person'
//   }
// ]
