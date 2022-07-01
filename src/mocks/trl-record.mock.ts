import { VehicleTechRecordModel, StatusCodes, VehicleTypes, VehicleConfigurations, FrameDescriptions, EuVehicleCategories, approvalType, PlateReasonForIssue } from '../app/models/vehicle-tech-record.model';
import { createMock } from "ts-auto-mock";

export const createMockTrl = (systemNumber: number): VehicleTechRecordModel =>
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
            currentTechRecord
        ]
    });

const currentTechRecord = {
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
    plates: [{
        plateSerialNumber: "12345",
        plateIssueDate: new Date(),
        plateReasonForIssue: PlateReasonForIssue.REPLACEMENT,
        plateIssuer: "person"
    }]
}