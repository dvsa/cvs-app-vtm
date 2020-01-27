import {approvalDate} from '@app/models/approvalDate';

export interface CheckBoxValue {
  content: string;
  value: boolean;
  index: number;
}

export interface adrDetailsFormModel {
    name: string;
    street: string;
    town: string;
    city: string;
    postcode: string;
    type: string;
    approvalDate: approvalDate;
    permittedDangerousGoods: { [id: string]: CheckBoxValue };
    compatibilityJ: boolean;
    additionalNotes: { [id: string]: CheckBoxValue };
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
    tc3Type: number[];
    tc3PeriodicNumber: number[];
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
