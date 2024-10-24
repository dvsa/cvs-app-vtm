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

/**
 * Disability Discrimination Act
 */
export interface Dda {
	/**
	 * Used only for PSV
	 */
	certificateIssued?: boolean;
	/**
	 * Used only for PSV
	 */
	wheelchairCapacity?: number;
	/**
	 * Used only for PSV
	 */
	wheelchairFittings?: string;
	/**
	 * Used only for PSV
	 */
	wheelchairLiftPresent?: boolean;
	/**
	 * Used only for PSV
	 */
	wheelchairLiftInformation?: string;
	/**
	 * Used only for PSV
	 */
	wheelchairRampPresent?: boolean;
	/**
	 * Used only for PSV
	 */
	wheelchairRampInformation?: string;
	/**
	 * Used only for PSV
	 */
	minEmergencyExits?: number;
	/**
	 * Used only for PSV
	 */
	outswing?: string;
	/**
	 * Used only for PSV
	 */
	ddaSchedules?: string;
	/**
	 * Used only for PSV
	 */
	seatbeltsFitted?: number;
	/**
	 * Used only for PSV
	 */
	ddaNotes?: string;
}
