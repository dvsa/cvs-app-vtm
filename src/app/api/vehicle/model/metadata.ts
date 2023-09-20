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
import { MetadataAdrDetails } from './metadataAdrDetails';

/**
 * Applicable only to ADR details. Returned only if query param \"metadata\" = \"true\", otherwise not returned
 */
export interface Metadata {
  /**
     * makeFe and chassisMakeFe fields have the same value. Combining them into a field for now so we don't send the same list twice.
     */
  makeAndChassisMakeFe?: Array<string>;
  bodyMakeFe?: Array<string>;
  adrDetails?: MetadataAdrDetails;
}
