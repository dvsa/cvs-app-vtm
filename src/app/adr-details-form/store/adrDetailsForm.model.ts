import { Boxed } from "ngrx-forms";

export interface approvalDate {
  day: number;
  month: number;
  year: number;
}

export interface adrDetailsFormModel {
  name: string;
  street: string;
  town: string;
  city: string;
  postcode: string;
  type: string;
  approvalDate: approvalDate;
  permittedDangerousGoods: { [id: string]: boolean };
  compatibilityJ: boolean;
  additionalNotes: { [id: string]: boolean };
  adrTypeApprovalNo: string;
  tankManufacturer: string;
  yearOfManufacture: number;
  tankManufacturerSerialNo: string;
  tankTypeAppNo: string;
  tankCode: string;
  tankDocuments: (string | ArrayBuffer)[];
  substancesPermitted: string;
  selectReferenceNumber: string;
  statement: string;
  productListRefNo: string;
  productListUnNo: number[];
  productList: string;
  specialProvisions: string;
  tc2Type: string;
  tc2IntermediateApprovalNo: string;
  tc2IntermediateExpiryDate: {
    day: number;
    month: number;
    year: number;
  };
  tc3Type: string;
  tc3PeriodicNumber: string;
  tc3PeriodicExpiryDate: {
    day: number;
    month: number;
    year: number;
  }[];
  memosApply: { [id: string]: boolean };
  listStatementApplicable: '';
  batteryListNumber: string;
  brakeDeclarationIssuer: string;
  brakeEndurance: string;
  brakeDeclarationsSeen: string;
  declarationsSeen: string;
  weight: number;
  certificateReq: string;
  adrMoreDetail: string;
}

