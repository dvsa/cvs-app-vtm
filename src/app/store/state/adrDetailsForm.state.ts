import { IAppState as RootState } from './app.state';
import { adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import { createFormGroupState, FormGroupState, box } from 'ngrx-forms';

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
    'Danger 1': false,
    'Danger xyz': false,
  },
  compatibilityJ: false,
  additionalNotes: {},
  adrTypeApprovalNo: '',
  tankManufacturer: '',
  yearOfManufacture: 1,
  tankManufacturerSerialNo: '',
  tankTypeAppNo: '',
  tankCode: '',
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
  tc3PeriodicExpiryDate: [{
    day: 1,
    month: 1,
    year: 1920
  }],
  memosApply: {
    isMemo: true,
    isNotMemo: true,
  },
  listStatementApplicable: {
    applicable: true,
    notApplicable: false,
  },
  batteryListNumber: '',
  brakeDeclarationIssuer: '',
  brakeEndurance: '',
  brakeDeclarationsSeen: '',
  declarationsSeen: '',
  weight: 0,
  certificateReq: {
    yesCert: true,
    noCert: false,
  },
  adrMoreDetail: ''
});
