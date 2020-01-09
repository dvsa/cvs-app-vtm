import { createFormGroupState, FormGroupState, box } from 'ngrx-forms';
import { adrDetailsFormModel } from './adrDetailsForm.model';
import {IAppState as RootState} from '../../store/state/app.state';

export interface IAppState extends RootState {
  adrDetails: {
    formState: FormGroupState<adrDetailsFormModel>;
    permittedDangerousGoodsOptions: string[];
    additionalNotesOptions: string[];
    productListUnNo: {
      maxIndex: number;
      options: number[];
    };
    tc3Type: {
      maxIndex: number;
      options: number[];
    };
    tc3PeriodicNumber: {
      maxIndex: number;
      options: number[];
    };
    tc3PeriodicExpiryDate: {
      maxIndex: number;
      options: { day: number; month: number; year: number; }[];
    };
    tankDocuments: {
      maxIndex: number;
      options: (string | ArrayBuffer) [];
    };
    submittedValue: adrDetailsFormModel | undefined;
  };
}

export const FORM_ID = 'adrDetails';

export const INITIAL_STATE = createFormGroupState<adrDetailsFormModel>(FORM_ID, {
  name: '',
  street: '',
  town: '',
  city: '',
  postcode: '',
  type: '',
  approvalDate: {
    day: 1,
    month: 1,
    year: 1920
  },
  permittedDangerousGoods: {
  },
  compatibilityJ: false,
  additionalNotes: {},
  adrTypeApprovalNo: '',
  tankManufacturer: '',
  yearOfManufacture: 1,
  tankManufacturerSerialNo: '',
  tankTypeAppNo: '',
  tankCode: '',
  tankDocuments:[],
  substancesPermitted: '',
  selectReferenceNumber: '',
  statement: '',
  productListRefNo: '',
  productListUnNo: [],
  productList: '',
  specialProvisions: '',
  tc2Type: '',
  tc2IntermediateApprovalNo: '',
  tc2IntermediateExpiryDate: {
    day: 1,
    month: 1,
    year: 1920
  },
  tc3Type: '',
  tc3PeriodicNumber: '',
  tc3PeriodicExpiryDate: [],
  memosApply: { '07/09 3mth leak ext': false },
  listStatementApplicable: '',
  batteryListNumber: '',
  brakeDeclarationIssuer: '',
  brakeEndurance: '',
  brakeDeclarationsSeen: '',
  declarationsSeen: '',
  weight: 0,
  certificateReq: '',
  adrMoreDetail: ''
});

export function createInitialState(initialAdrDetails: any): any {
  return {
    name: initialAdrDetails.applicantDetails.name,
    street: initialAdrDetails.applicantDetails.street,
    town: initialAdrDetails.applicantDetails.town,
    city: initialAdrDetails.applicantDetails.city,
    postcode: initialAdrDetails.applicantDetails.postcode,
    type: initialAdrDetails.vehicleDetails.type,
    approvalDate: {
      day: initialAdrDetails.vehicleDetails.approvalDate.split('-')[2],
      month: initialAdrDetails.vehicleDetails.approvalDate.split('-')[1],
      year: initialAdrDetails.vehicleDetails.approvalDate.split('-')[0]
    },
    permittedDangerousGoods: {
    },
    compatibilityJ: false,
    additionalNotes: {},
    adrTypeApprovalNo: initialAdrDetails.adrTypeApprovalNo,
    tankManufacturer: initialAdrDetails.tank.tankDetails.tankManufacturer,
    yearOfManufacture: initialAdrDetails.tank.tankDetails.yearOfManufacture,
    tankManufacturerSerialNo: initialAdrDetails.tank.tankDetails.tankManufacturerSerialNo,
    tankTypeAppNo: initialAdrDetails.tank.tankDetails.tankTypeAppNo,
    tankCode: initialAdrDetails.tank.tankDetails.tankCode,
    tankDocuments: initialAdrDetails.documents,
    substancesPermitted: initialAdrDetails.tank.tankStatement.substancesPermitted,
    selectReferenceNumber: initialAdrDetails.tank.tankStatement ? initialAdrDetails.tank.tankStatement.hasOwnProperty("statement") ? "isStatement" : "isProductListRefNo" : "",
    statement: initialAdrDetails.tank.tankStatement.statement,
    productListRefNo: initialAdrDetails.tank.tankStatement.productListRefNo,
    productListUnNo: [initialAdrDetails.tank.tankStatement.productListUnNo],
    productList: initialAdrDetails.tank.tankStatement.productList,
    specialProvisions: initialAdrDetails.tank.tankDetails.specialProvisions,
    tc2Type: initialAdrDetails.tank.tankDetails.tc2Details.tc2Type,
    tc2IntermediateApprovalNo: initialAdrDetails.tank.tankDetails.tc2Details.tc2IntermediateApprovalNo,
    tc2IntermediateExpiryDate: {
      day: initialAdrDetails.tank.tankDetails.tc2Details.tc2IntermediateExpiryDate ? initialAdrDetails.tank.tankDetails.tc2Details.tc2IntermediateExpiryDate.split('-')[2] : "",
      month: initialAdrDetails.tank.tankDetails.tc2Details.tc2IntermediateExpiryDate ? initialAdrDetails.tank.tankDetails.tc2Details.tc2IntermediateExpiryDate.split('-')[1] : "",
      year: initialAdrDetails.tank.tankDetails.tc2Details.tc2IntermediateExpiryDate ? initialAdrDetails.tank.tankDetails.tc2Details.tc2IntermediateExpiryDate.split('-')[0] : ""
    },
    tc3Type: [],
    tc3PeriodicNumber: [],
    tc3PeriodicExpiryDate: [],
    memosApply: initialAdrDetails.memosApply ? initialAdrDetails.memosApply.includes('07/09 3mth leak ext') ? "07/09 3mth leak ext" : "" : "",
    listStatementApplicable: initialAdrDetails.listStatementApplicable ? "applicable" : "notApplicable", // boolean in DB
    batteryListNumber: initialAdrDetails.batteryListNumber,
    brakeDeclarationIssuer: initialAdrDetails.brakeDeclarationIssuer,
    brakeEndurance: initialAdrDetails.brakeEndurance, // boolean in DB
    brakeDeclarationsSeen: initialAdrDetails.brakeDeclarationsSeen,
    declarationsSeen: initialAdrDetails.declarationsSeen, // boolean in DB
    weight: initialAdrDetails.weight * 1000 ,
    certificateReq: initialAdrDetails.additionalNotes.guidanceNotes ? initialAdrDetails.additionalNotes.guidanceNotes.includes('New certificate requested') ? "New certificate requested" : "" : "",
    adrMoreDetail: initialAdrDetails.additionalExaminerNotes
  };
}
