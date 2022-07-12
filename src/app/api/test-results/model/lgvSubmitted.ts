/**
 * Test Results Microservice
 * This is the API spec for capturing test results. These test result will be stored in the AWS DynamoDB database. Authorization details will be updated once we have confirmed the security scheme we are using.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: test@test.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CarCancelledVehicleClass } from './carCancelledVehicleClass';
import { CarSubmittedTestTypes } from './carSubmittedTestTypes';

export interface LgvSubmitted { 
    testResultId: string;
    systemNumber: string;
    vin: string;
    testStationName: string;
    testStationPNumber: string;
    testStationType: string;
    testerName: string;
    testerEmailAddress: string;
    testerStaffId: string;
    testStartTimestamp: Date;
    testEndTimestamp: Date;
    testStatus: LgvSubmitted.TestStatusEnum;
    vehicleClass?: CarCancelledVehicleClass;
    vehicleType: string;
    noOfAxles: number;
    preparerId: string;
    preparerName: string;
    numberOfWheelsDriven: number;
    regnDate?: string;
    firstUseDate?: string;
    euVehicleCategory: string;
    reasonForCreation?: string;
    createdAt?: string;
    createdByName?: string;
    createdById?: string;
    lastUpdatedAt?: string;
    lastUpdatedByName?: string;
    lastUpdatedById?: string;
    shouldEmailCertificate?: string;
    vrm: string;
    countryOfRegistration: string;
    odometerReading: number;
    odometerReadingUnits: LgvSubmitted.OdometerReadingUnitsEnum;
    reasonForCancellation: string;
    vehicleConfiguration: LgvSubmitted.VehicleConfigurationEnum;
    testTypes: Array<CarSubmittedTestTypes>;
    vehicleSubclass: Array<string>;
}
export namespace LgvSubmitted {
    export type TestStatusEnum = 'submitted' | 'cancelled';
    export const TestStatusEnum = {
        Submitted: 'submitted' as TestStatusEnum,
        Cancelled: 'cancelled' as TestStatusEnum
    };
    export type OdometerReadingUnitsEnum = 'kilometres' | 'miles';
    export const OdometerReadingUnitsEnum = {
        Kilometres: 'kilometres' as OdometerReadingUnitsEnum,
        Miles: 'miles' as OdometerReadingUnitsEnum
    };
    export type VehicleConfigurationEnum = 'rigid' | 'articulated' | 'centre axle drawbar' | 'semi-car transporter' | 'semi-trailer' | 'low loader' | 'other' | 'drawbar' | 'four-in-line' | 'dolly' | 'full drawbar';
    export const VehicleConfigurationEnum = {
        Rigid: 'rigid' as VehicleConfigurationEnum,
        Articulated: 'articulated' as VehicleConfigurationEnum,
        CentreAxleDrawbar: 'centre axle drawbar' as VehicleConfigurationEnum,
        SemiCarTransporter: 'semi-car transporter' as VehicleConfigurationEnum,
        SemiTrailer: 'semi-trailer' as VehicleConfigurationEnum,
        LowLoader: 'low loader' as VehicleConfigurationEnum,
        Other: 'other' as VehicleConfigurationEnum,
        Drawbar: 'drawbar' as VehicleConfigurationEnum,
        FourInLine: 'four-in-line' as VehicleConfigurationEnum,
        Dolly: 'dolly' as VehicleConfigurationEnum,
        FullDrawbar: 'full drawbar' as VehicleConfigurationEnum
    };
}