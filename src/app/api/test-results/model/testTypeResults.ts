/**
 * Test Results Microservice
 * This is the API spec for capturing test results. These test result will be stored in the AWS DynamoDB database. Authorization details will be updated once we have confirmed the security scheme we are using.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CustomDefects } from './customDefects';
import { Defects } from './defects';
import { TestTypeResultsModType } from './testTypeResultsModType';

export interface TestTypeResults { 
    /**
     * Not sent from FE, calculated in the BE.
     */
    createdAt?: Date;
    /**
     * Not sent from FE, calculated in the BE.
     */
    lastUpdatedAt?: Date;
    /**
     * Not sent from FE, calculated in the BE.
     */
    deletionFlag?: boolean;
    /**
     * Not sent from FE, calculated in the BE.
     */
    testCode?: string;
    testTypeName?: string;
    name?: string;
    testTypeId?: string;
    /**
     * Not sent from FE, calculated in the BE.
     */
    testNumber?: string;
    certificateNumber?: string;
    secondaryCertificateNumber?: string;
    /**
     * Not sent from FE, calculated in the BE.
     */
    certificateLink?: string;
    /**
     * Sent form FE only for LEC tests. For the rest of the test types it is not sent from FE, and calculated in the BE.
     */
    testExpiryDate?: Date;
    /**
     * Not sent from FE, calculated in the BE.
     */
    testAnniversaryDate?: Date;
    testTypeStartTimestamp?: Date;
    /**
     * Nullable only for Cancelled tests.
     */
    testTypeEndTimestamp?: Date;
    /**
     * Sent from FE. Used to determine which test-type was updated/archived
     */
    statusUpdatedFlag?: boolean;
    /**
     * mandatory for PSV only, not applicable for HGV and TRL
     */
    numberOfSeatbeltsFitted?: number;
    /**
     * mandatory for PSV only, not applicable for HGV and TRL
     */
    lastSeatbeltInstallationCheckDate?: string;
    /**
     * mandatory for PSV only, not applicable for HGV and TRL
     */
    seatbeltInstallationCheckDate?: boolean;
    /**
     * Nullable only for Cancelled tests.
     */
    testResult?: TestTypeResults.TestResultEnum;
    prohibitionIssued?: boolean;
    /**
     * Required for Abandoned tests.
     */
    reasonForAbandoning?: string;
    additionalNotesRecorded?: string;
    additionalCommentsForAbandon?: string;
    modType?: TestTypeResultsModType;
    /**
     * Used only for LEC tests.
     */
    emissionStandard?: TestTypeResults.EmissionStandardEnum;
    /**
     * Used only for LEC tests.
     */
    fuelType?: TestTypeResults.FuelTypeEnum;
    /**
     * Used only for LEC tests.
     */
    particulateTrapFitted?: string;
    /**
     * Used only for LEC tests.
     */
    particulateTrapSerialNumber?: string;
    /**
     * Used only for LEC tests.
     */
    modificationTypeUsed?: string;
    /**
     * Used only for LEC tests.
     */
    smokeTestKLimitApplied?: string;
    defects?: Defects;
    customDefects?: CustomDefects;
}
export namespace TestTypeResults {
    export type TestResultEnum = 'fail' | 'pass' | 'prs' | 'abandoned';
    export const TestResultEnum = {
        Fail: 'fail' as TestResultEnum,
        Pass: 'pass' as TestResultEnum,
        Prs: 'prs' as TestResultEnum,
        Abandoned: 'abandoned' as TestResultEnum
    };
    export type EmissionStandardEnum = '0.10 g/kWh Euro 3 PM' | '0.03 g/kWh Euro IV PM' | 'Euro 3' | 'Euro 4' | 'Euro 6' | 'Euro VI' | 'Full Electric';
    export const EmissionStandardEnum = {
        _010GkWhEuro3PM: '0.10 g/kWh Euro 3 PM' as EmissionStandardEnum,
        _003GkWhEuroIVPM: '0.03 g/kWh Euro IV PM' as EmissionStandardEnum,
        Euro3: 'Euro 3' as EmissionStandardEnum,
        Euro4: 'Euro 4' as EmissionStandardEnum,
        Euro6: 'Euro 6' as EmissionStandardEnum,
        EuroVI: 'Euro VI' as EmissionStandardEnum,
        FullElectric: 'Full Electric' as EmissionStandardEnum
    };
    export type FuelTypeEnum = 'diesel' | 'gas-cng' | 'gas-lng' | 'gas-lpg' | 'fuel cell' | 'petrol' | 'full electric';
    export const FuelTypeEnum = {
        Diesel: 'diesel' as FuelTypeEnum,
        GasCng: 'gas-cng' as FuelTypeEnum,
        GasLng: 'gas-lng' as FuelTypeEnum,
        GasLpg: 'gas-lpg' as FuelTypeEnum,
        FuelCell: 'fuel cell' as FuelTypeEnum,
        Petrol: 'petrol' as FuelTypeEnum,
        FullElectric: 'full electric' as FuelTypeEnum
    };
}