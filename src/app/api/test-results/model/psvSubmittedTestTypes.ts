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
import { CarCancelledCustomDefects } from './carCancelledCustomDefects';
import { CarCancelledModType } from './carCancelledModType';
import { PsvSubmittedDefects } from './psvSubmittedDefects';

export interface PsvSubmittedTestTypes { 
    name: string;
    testTypeName: string;
    testTypeId: string;
    testTypeStartTimestamp: Date;
    certificateNumber: string;
    prohibitionIssued: boolean;
    reasonForAbandoning: string;
    additionalNotesRecorded: string;
    additionalCommentsForAbandon: string;
    customDefects: Array<CarCancelledCustomDefects>;
    secondaryCertificateNumber: string;
    emissionStandard?: string;
    fuelType?: string;
    testTypeEndTimestamp: Date;
    numberOfSeatbeltsFitted: number;
    lastSeatbeltInstallationCheckDate: Date;
    seatbeltInstallationCheckDate: boolean;
    testResult: string;
    testExpiryDate?: Date;
    defects: Array<PsvSubmittedDefects>;
    modType?: CarCancelledModType;
    particulateTrapSerialNumber?: string;
    smokeTestKLimitApplied?: string;
    modificationTypeUsed?: string;
    particulateTrapFitted?: string;
}