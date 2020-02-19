import { Tank } from './Tank';

interface VehicleDetails {
  type: string;
  approvalDate: string;
}

interface AdditionalNotes {
  number: string[];
  guidanceNotes: string[];
}

export interface ApplicantDetails {
  name: string;
  street: string;
  town: string;
  city: string;
  postcode: string;
}

export interface AdrDetails {
  vehicleDetails: VehicleDetails;
  listStatementApplicable: boolean;
  batteryListNumber: string;
  declarationsSeen: boolean;
  brakeDeclarationsSeen: boolean;
  brakeDeclarationIssuer: string;
  brakeEndurance: boolean;
  weight: string;
  compatibilityGroupJ?: boolean;
  documents: string[];
  permittedDangerousGoods: string[];
  additionalExaminerNotes: string;
  applicantDetails: ApplicantDetails;
  memosApply: string[];
  additionalNotes: AdditionalNotes;
  adrTypeApprovalNo: string;
  tank: Tank;
}
