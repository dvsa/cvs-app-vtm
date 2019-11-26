import { IAppState as RootState } from './app.state';
import { adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import { createFormGroupState, FormGroupState } from 'ngrx-forms';

export interface IAppState extends RootState {
  adrDetails: {
    formState: FormGroupState<adrDetailsFormModel>;
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
  permittedDangerousGoods: false,
  compatibilityGroupJ: {
    compatibilityJ: false
  },
  additionalNotes: '',
  adrTypeApprovalNo: '',
  tankManufacturer: '',
  yearOfManufacture: 1,
  tankManufacturerSerialNo: '',
  tankTypeAppNo: '',
  tankCode: '',
  substancesPermitted: {
    underTankCode: '',
    classUN: '',
  },
  selectReferenceNumber: {
    isStatement: '',
    isProductListRefNo: '',
  },
  statement: '',
  productListRefNo: '',
  productListUnNo: 0,
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
  tc3PeriodicNumber: 0,
  tc3PeriodicExpiryDate: {
    day: 1,
    month: 1,
    year: 1920
  },
  memosApply: {
    isMemo: true,
    isNotMemo: true,
  },
  listStatementApplicable: {
    applicable: true,
    notApplicable: false,
  },
  batteryListNumber: 0,
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