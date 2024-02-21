export interface TestResultRequiredStandard {
  sectionNumber: string;
  sectionDescription: string;
  rsNumber: number;
  requiredStandard: string;
  refCalculation: string;
  additionalInfo: boolean;
  inspectionTypes: INSPECTION_TYPE[];
  prs?: boolean;
  additionalNotes?: string;
}

export enum INSPECTION_TYPE {
  NORMAL = 'normal',
  BASIC = 'basic',
}
