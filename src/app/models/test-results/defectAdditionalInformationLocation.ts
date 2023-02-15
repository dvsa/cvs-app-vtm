/**
 * Test Results Microservice
 * This is the API spec for capturing test results. These test result will be stored in the AWS DynamoDB database. Authorization details will be updated once we have confirmed the security scheme we are using.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface DefectAdditionalInformationLocation {
  vertical?: DefectAdditionalInformationLocation.VerticalEnum;
  horizontal?: DefectAdditionalInformationLocation.HorizontalEnum;
  lateral?: DefectAdditionalInformationLocation.LateralEnum;
  longitudinal?: DefectAdditionalInformationLocation.LongitudinalEnum;
  rowNumber?: number;
  seatNumber?: number;
  axleNumber?: number;
}
export namespace DefectAdditionalInformationLocation {
  export type VerticalEnum = 'upper' | 'lower';
  export const VerticalEnum = {
    Upper: 'upper' as VerticalEnum,
    Lower: 'lower' as VerticalEnum
  };
  export type HorizontalEnum = 'inner' | 'outer';
  export const HorizontalEnum = {
    Inner: 'inner' as HorizontalEnum,
    Outer: 'outer' as HorizontalEnum
  };
  export type LateralEnum = 'nearside' | 'centre' | 'offside';
  export const LateralEnum = {
    Nearside: 'nearside' as LateralEnum,
    Centre: 'centre' as LateralEnum,
    Offside: 'offside' as LateralEnum
  };
  export type LongitudinalEnum = 'front' | 'rear';
  export const LongitudinalEnum = {
    Front: 'front' as LongitudinalEnum,
    Rear: 'rear' as LongitudinalEnum
  };
}
