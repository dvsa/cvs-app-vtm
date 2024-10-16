/**
 * Vehicles Microservice
 * This is the API spec for the vehicle microservice. Endpoints and parameters only exist for the operations getVehicle and getTechRecords. Other operations within the microservice are out of scope.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AdrDetailsAdditionalNotes } from './adrDetailsAdditionalNotes';
import { AdrDetailsApplicantDetails } from './adrDetailsApplicantDetails';
import { AdrDetailsTank } from './adrDetailsTank';
import { AdrDetailsVehicleDetails } from './adrDetailsVehicleDetails';

/**
 * Used only for HGV and TRL
 */
export interface AdrDetails {
	vehicleDetails?: AdrDetailsVehicleDetails;
	/**
	 * Optional. Applicable only if vehicleDetails.type contains the word ‘battery’.
	 */
	listStatementApplicable?: boolean;
	/**
	 * Mandatory if listStatementApplicable is true, therefore applicable only if vehicleDetails.type contains the word ‘battery’. Else N/A
	 */
	batteryListNumber?: string;
	/**
	 * Optional for all vehicle types
	 */
	declarationsSeen?: boolean;
	/**
	 * Optional for all vehicle types
	 */
	brakeDeclarationsSeen?: boolean;
	/**
	 * Optional for all vehicle types
	 */
	brakeDeclarationIssuer?: string;
	/**
	 * Optional for all vehicle types
	 */
	brakeEndurance?: boolean;
	/**
	 * Mandatory if brakeEndurance = true, else N/A
	 */
	weight?: string;
	/**
	 * Optional for all vehicle types
	 */
	compatibilityGroupJ?: boolean;
	/**
	 * Optional. Applicable only if vehicleDetails.type contains the word ‘tank’ or ‘battery’.
	 */
	documents?: Array<string>;
	/**
	 * Mandatory. Users must select, AT LEAST ONE of these. However, users CAN select more than one
	 */
	permittedDangerousGoods?: Array<string>;
	/**
	 * Optional for all vehicle types
	 */
	additionalExaminerNotes?: string;
	applicantDetails?: AdrDetailsApplicantDetails;
	memosApply?: Array<string>;
	additionalNotes?: AdrDetailsAdditionalNotes;
	adrTypeApprovalNo?: string;
	adrCertificateNotes?: string;
	tank?: AdrDetailsTank;
}
