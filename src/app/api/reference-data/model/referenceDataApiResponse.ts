/**
 * Reference Data Microservice
 * This is the API spec for the reference data service. The reference data will be stored in a AWS DynamoDB database.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: test@test.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ReferenceDataApiResponseWithPagination } from './referenceDataApiResponseWithPagination';
import { ReferenceDataApiResponseWithoutPagination } from './referenceDataApiResponseWithoutPagination';

export type ReferenceDataApiResponse = ReferenceDataApiResponseWithoutPagination | ReferenceDataApiResponseWithPagination;