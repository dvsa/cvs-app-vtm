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

export interface PlatesInner {
	/**
	 * Used for all vehicle types
	 */
	plateSerialNumber?: string;
	/**
	 * Used for all vehicle types
	 */
	plateIssueDate?: string;
	/**
	 * Used for all vehicle types
	 */
	plateReasonForIssue?: PlatesInner.PlateReasonForIssueEnum;
	/**
	 * Used for all vehicle types
	 */
	plateIssuer?: string;
	/**
	 * Used for all vehicle types
	 */
	toEmailAddress?: string;
}
export namespace PlatesInner {
	export type PlateReasonForIssueEnum =
		| 'Free replacement'
		| 'Replacement'
		| 'Destroyed'
		| 'Provisional'
		| 'Original'
		| 'Manual';
	export const PlateReasonForIssueEnum = {
		FreeReplacement: 'Free replacement' as PlateReasonForIssueEnum,
		Replacement: 'Replacement' as PlateReasonForIssueEnum,
		Destroyed: 'Destroyed' as PlateReasonForIssueEnum,
		Provisional: 'Provisional' as PlateReasonForIssueEnum,
		Original: 'Original' as PlateReasonForIssueEnum,
		Manual: 'Manual' as PlateReasonForIssueEnum,
	};
}
