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
import { TechRecordArchiveAndProvisionalPayloadMsUserDetails } from './techRecordArchiveAndProvisionalPayloadMsUserDetails';
import { TechRecords } from './techRecords';

export interface TechRecordPUT {
	msUserDetails?: TechRecordArchiveAndProvisionalPayloadMsUserDetails;
	/**
	 * Mandatory for PSV, HGV, car, lgv, motorcycle. Optional for TRL
	 */
	primaryVrm?: string;
	/**
	 * Mandatory for PSV and HGV. Optional for TRL
	 */
	secondaryVrms?: Array<string>;
	/**
	 * Used only for TRL. Optional for HGV and PSV
	 */
	trailerId?: string;
	techRecord?: TechRecords;
}