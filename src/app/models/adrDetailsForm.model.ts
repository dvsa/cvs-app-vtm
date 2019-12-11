import {approvalDate} from '@app/models/approvalDate';


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
    };
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
