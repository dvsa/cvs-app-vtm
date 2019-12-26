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
  tc3Type: [],
  tc3PeriodicNumber: [],
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
    adrTypeApprovalNo: '',
    tankManufacturer: initialAdrDetails.tank.tankDetails.tankManufacturer,
    yearOfManufacture: initialAdrDetails.tank.tankDetails.yearOfManufacture,
    tankManufacturerSerialNo: initialAdrDetails.tank.tankDetails.tankManufacturerSerialNo,
    tankTypeAppNo: initialAdrDetails.tank.tankDetails.tankTypeAppNo,
    tankCode: initialAdrDetails.tank.tankDetails.tankCode,
    tankDocuments: initialAdrDetails.documents,
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
    tc3Type: [],
    tc3PeriodicNumber: [],
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
  };
}
