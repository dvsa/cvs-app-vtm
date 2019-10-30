import {AdditionalInformation} from '@app/models/additional.information';

export interface Defect {
  prohibitionIssued: boolean;
  additionalInformation: AdditionalInformation;
  itemNumber: number;
  deficiencyRef: string;
  stdForProhibition: boolean;
  deficiencyId: string;
  imNumber: number;
  deficiencyCategory: string;
  deficiencyText: string;
  prs: boolean;
  deficiencySubId?: any;
  imDescription: string;
  itemDescription: string;
}
