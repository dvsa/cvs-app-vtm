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
  deficiencyCategory: Defect.DeficiencyCategoryEnum;
  deficiencyText?: string;
  stdForProhibition?: boolean;
  prs?: boolean;
  prohibitionIssued?: boolean;
}

export namespace Defect {
  export type DeficiencyCategoryEnum = 'advisory' | 'dangerous' | 'major' | 'minor';
  export const DeficiencyCategoryEnum = {
    Advisory: 'advisory' as DeficiencyCategoryEnum,
    Dangerous: 'dangerous' as DeficiencyCategoryEnum,
    Major: 'major' as DeficiencyCategoryEnum,
    Minor: 'minor' as DeficiencyCategoryEnum
  };
}
