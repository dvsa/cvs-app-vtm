import * as adrDetailsActions from './adrDetails.actions';
import { adrDetailsFormModelState } from './adrDetailsMockObjects';

describe('adrDetailsAction', () => {
  test('LoadAction', () => {
    const payload = 'test';
    const action = new adrDetailsActions.LoadAction(payload);
    
    expect(action.type).toBe(adrDetailsActions.LoadAction.TYPE);
    expect(action.payload).toBe(payload);
  });

  test('SetSubmittedValueAction', () => {
    const payload = adrDetailsFormModelState;
    const action = new adrDetailsActions.SetSubmittedValueAction(payload);
    
    expect(action.type).toBe(adrDetailsActions.SetSubmittedValueAction.TYPE);
    expect(action.submittedValue).toBe(payload);
  });

  test('SetMsUserDetailsAction', () => {
    const payload = adrDetailsFormModelState;
    const action = new adrDetailsActions.SetMsUserDetailsAction(payload);
    
    expect(action.type).toBe(adrDetailsActions.SetMsUserDetailsAction.TYPE);
    expect(action.msUserDetails).toBe(payload);
  });

  test('CreatePermittedDangerousGoodElementAction', () => {
    const payload = false;
    const name = 'test';
    const action = new adrDetailsActions.CreatePermittedDangerousGoodElementAction(name, payload);
    
    expect(action.type).toBe(adrDetailsActions.CreatePermittedDangerousGoodElementAction.TYPE);
    expect(action.payload).toBe(payload);
    expect(action.name).toBe(name);
  });

  test('RemovePermittedDangerousGoodElementAction', () => {
    const name = 'test';
    const action = new adrDetailsActions.RemovePermittedDangerousGoodElementAction(name);
    
    expect(action.type).toBe(adrDetailsActions.RemovePermittedDangerousGoodElementAction.TYPE);
    expect(action.name).toBe(name);
  });

  test('CreateGuidanceNoteElementAction', () => {
    const payload = false;
    const name = 'test';
    const action = new adrDetailsActions.CreateGuidanceNoteElementAction(name, payload);
    
    expect(action.type).toBe(adrDetailsActions.CreateGuidanceNoteElementAction.TYPE);
    expect(action.payload).toBe(payload);
    expect(action.name).toBe(name);
  });

  test('RemoveGuidanceNoteElementAction', () => {
    const name = 'test';
    const action = new adrDetailsActions.RemoveGuidanceNoteElementAction(name);
    
    expect(action.type).toBe(adrDetailsActions.RemoveGuidanceNoteElementAction.TYPE);
    expect(action.name).toBe(name);
  });

  test('CreateProductListUnNoElementAction', () => {
    const payload = 'false';
    const name = 'test';
    const action = new adrDetailsActions.CreateProductListUnNoElementAction(name, payload);
    
    expect(action.type).toBe(adrDetailsActions.CreateProductListUnNoElementAction.TYPE);
    expect(action.payload).toBe(payload);
    expect(action.name).toBe(name);
  });

  test('RemoveProductListUnNoElementAction', () => {
    const name = 'test';
    const action = new adrDetailsActions.RemoveProductListUnNoElementAction(name);
    
    expect(action.type).toBe(adrDetailsActions.RemoveProductListUnNoElementAction.TYPE);
    expect(action.name).toBe(name);
  });

  test('CreateTc3TypeElementAction', () => {
    const payload = false;
    const controlId = 'test';
    const index = 3;
    const action = new adrDetailsActions.CreateTc3TypeElementAction(controlId, payload, index);
    
    expect(action.subtype).toBe(adrDetailsActions.CreateTc3TypeElementAction.SUB_TYPE);
    expect(action.value).toBe(payload);
    expect(action.index).toBe(index);
  });

  test('CreateTc3PeriodicNumberElementAction', () => {
    const payload = false;
    const controlId = 'test';
    const index = 3;
    const action = new adrDetailsActions.CreateTc3PeriodicNumberElementAction(controlId, payload, index);
    
    expect(action.subtype).toBe(adrDetailsActions.CreateTc3PeriodicNumberElementAction.SUB_TYPE);
    expect(action.value).toBe(payload);
    expect(action.index).toBe(index);
  });

  test('CreateTc3PeriodicExpiryDateElementAction', () => {
    const payload = false;
    const controlId = 'test';
    const index = 3;
    const action = new adrDetailsActions.CreateTc3PeriodicExpiryDateElementAction(controlId, payload, index);
    
    expect(action.subtype).toBe(adrDetailsActions.CreateTc3PeriodicExpiryDateElementAction.SUB_TYPE);
    expect(action.value).toBe(payload);
    expect(action.index).toBe(index);
  });

  test('DownloadDocumentFileAction', () => {
    const name = 'test';
    const action = new adrDetailsActions.DownloadDocumentFileAction(name);
    
    expect(action.type).toBe(adrDetailsActions.DownloadDocumentFileAction.TYPE);
    expect(action.filename).toBe(name);
  });

  test('DownloadDocumentFileActionSuccess', () => {
    const payload = { blob: new Blob([]), filename: 'test' };

    const action = new adrDetailsActions.DownloadDocumentFileActionSuccess(payload);
    
    expect(action.type).toBe(adrDetailsActions.DownloadDocumentFileActionSuccess.TYPE);
    expect(action.payload).toBe(payload);
  });

  test('DownloadDocumentFileActionFailure', () => {
    const payload = { blob: new Blob([]), filename: 'test' };

    const action = new adrDetailsActions.DownloadDocumentFileActionFailure(payload);
    
    expect(action.type).toBe(adrDetailsActions.DownloadDocumentFileActionFailure.TYPE);
    expect(action.payload).toBe(payload);
  });

  test('AddTankDocumentAction', () => {
    const payload = 'false';
    const controlId = 'test';
    const index = 3;
    const action = new adrDetailsActions.AddTankDocumentAction(controlId, payload, index);
    
    expect(action.subtype).toBe(adrDetailsActions.AddTankDocumentAction.SUB_TYPE);
    expect(action.value).toBe(payload);
    expect(action.index).toBe(index);
  });

  test('RemoveTankDocumentAction', () => {
    const payload = 'false';
    const controlId = 'test';
    const index = 3;
    const action = new adrDetailsActions.RemoveTankDocumentAction(controlId, index);
    
    expect(action.subtype).toBe(adrDetailsActions.RemoveTankDocumentAction.SUB_TYPE);
    expect(action.index).toBe(index);
  });
});