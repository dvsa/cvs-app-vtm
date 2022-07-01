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
import { CarSubmittedAdditionalInformation } from './carSubmittedAdditionalInformation';

export interface CarSubmittedDefects { 
    imNumber: number;
    imDescription: string;
    itemNumber: number;
    itemDescription: string;
    deficiencyRef: string;
    deficiencyId: string;
    deficiencySubId: string;
    deficiencyCategory: string;
    deficiencyText: string;
    stdForProhibition: boolean;
    prohibitionIssued: boolean;
    prs: boolean;
    additionalInformation: CarSubmittedAdditionalInformation;
}