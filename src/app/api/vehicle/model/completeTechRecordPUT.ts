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
import { TechRecords } from './techRecords';
import { Vrms } from './vrms';

export interface CompleteTechRecordPUT {
	/**
	 * It defines the composed primary key, in combination with \"vin\".
	 */
	systemNumber?: string;
	vrms?: Vrms;
	/**
	 * Used for all vehicle types - PSV, HGV, TRL, car, lgv, motorcycle
	 */
	vin?: string;
	/**
	 * Used only for TRL
	 */
	trailerId?: string;
	techRecord?: TechRecords;
}
