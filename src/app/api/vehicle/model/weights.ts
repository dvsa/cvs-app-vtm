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
import { AxleBrakeProperties } from './axleBrakeProperties';
import { AxleTyreProperties } from './axleTyreProperties';
import { AxleWeightProperties } from './axleWeightProperties';

export interface Weights {
  /**
     * Used for all vehicle types - PSV, HGV and TRL
     */
  axleNumber?: number;
  /**
     * Used for all vehicle types - PSV, HGV and TRL. Optional for HGV
     */
  parkingBrakeMrk?: boolean;
  weights?: AxleWeightProperties;
  tyres?: AxleTyreProperties;
  brakes?: AxleBrakeProperties;
}
