import { InspectionType } from '@dvsa/cvs-type-definitions/types/iva/defects/get';

export interface TestResultRequiredStandard {
  sectionNumber: string;
  sectionDescription: string;
  rsNumber: number;
  requiredStandard: string;
  refCalculation: string;
  additionalInfo: boolean;
  inspectionTypes: InspectionType[];
  prs?: boolean;
  additionalNotes?: string;
}

export enum INSPECTION_TYPE {
  NORMAL = 'normal',
  BASIC = 'basic',
}
