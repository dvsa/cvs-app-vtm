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
import { DefectAdditionalInformation } from './defectAdditionalInformation';

export interface Defect {
  imNumber?: number;
  imDescription?: string;
  additionalInformation?: DefectAdditionalInformation;
  itemNumber?: number;
  itemDescription?: string;
  deficiencyRef?: string;
  deficiencyId?: string;
  deficiencySubId?: string;
  /**
     * It is mandatory for both Submitted or Cancelled tests. It is only nullable in the DB for the migration purposes.
     */
  deficiencyCategory?: Defect.DeficiencyCategoryEnum;
  deficiencyText?: string;
  stdForProhibition?: boolean;
  prs?: boolean;
  prohibitionIssued?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Defect {
  export type DeficiencyCategoryEnum = 'advisory' | 'dangerous' | 'major' | 'minor';
  export const DeficiencyCategoryEnum = {
    Advisory: 'advisory' as DeficiencyCategoryEnum,
    Dangerous: 'dangerous' as DeficiencyCategoryEnum,
    Major: 'major' as DeficiencyCategoryEnum,
    Minor: 'minor' as DeficiencyCategoryEnum,
  };
}
