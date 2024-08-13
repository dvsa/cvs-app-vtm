/**
 * Test Types Microservice
 * This is the API spec for the test types microservice. This microservice has one endpoint which will get all of the test type data.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { TestType } from './testType';
import { TestTypeCategory } from './testTypeCategory';

export interface TestTypesTaxonomy extends Array<TestType | TestTypeCategory> {}
