import { SubmitAdrActionSuccess } from '@app/technical-record/store/adrDetailsSubmit.actions';
import { Action } from '@ngrx/store';
import { AddArrayControlAction, RemoveArrayControlAction } from 'ngrx-forms';
import * as AdrDetailsActions from './adrDetails.actions';
import { adrDetailsReducer } from './adrDetails.reducer';
import { adrDetailsFormModelState, adrDetailsState } from './adrDetailsMockObjects';

describe('adrDetailsReducer', () => {
  describe('permittedDangerousGoodsOptions', () => {
    test('CreatePermittedDangerousGoodElementAction', () => {
      const action: Action = new AdrDetailsActions.CreatePermittedDangerousGoodElementAction('test', false);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.permittedDangerousGoodsOptions.length).toBe(3);
      expect(result.permittedDangerousGoodsOptions[2]).toBe('test');
    });

    test('RemovePermittedDangerousGoodElementAction', () => {
      const action: Action = new AdrDetailsActions.RemovePermittedDangerousGoodElementAction('12');
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.permittedDangerousGoodsOptions.length).toBe(0);
    });

    test('SubmitAdrActionSuccess', () => {
      const action: Action = new SubmitAdrActionSuccess({});
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.permittedDangerousGoodsOptions).toBe(undefined);
    });
  });

  describe('additionalNotesOptions', () => {
    test('CreateGuidanceNoteElementAction', () => {
      const action: Action = new AdrDetailsActions.CreateGuidanceNoteElementAction('test', false);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.additionalNotesOptions.length).toBe(3);
      expect(result.additionalNotesOptions[2]).toBe('test');
    });

    test('RemoveGuidanceNoteElementAction', () => {
      const action: Action = new AdrDetailsActions.RemoveGuidanceNoteElementAction('123');
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.additionalNotesOptions.length).toBe(1);
      expect(result.additionalNotesOptions[0]).toBe('12');
    });

    test('CreateProductListUnNoElementAction', () => {
      const action: Action = new AdrDetailsActions.CreateProductListUnNoElementAction('test', 'test');
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.productListUnNo).toBeDefined();
      expect(result.productListUnNo).toEqual({'maxIndex': 2, 'options': [23, 123, 411]});
    });

  });

  describe('tc3Type', () => {
    test('CreateTc3TypeElementAction', () => {
      const action: Action = new AdrDetailsActions.CreateTc3TypeElementAction('12', 12, 12);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.tc3Type.maxIndex).toBe(4);
      expect(result.tc3Type.options.length).toBe(3);
      expect(result.tc3Type.options[0]).toBe(12);
    });
  });

  describe('tc3PeriodicNumber', () => {
    test('CreateTc3PeriodicNumberElementAction', () => {
      const action: Action = new AdrDetailsActions.CreateTc3PeriodicNumberElementAction('12', 12, 12);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.tc3PeriodicNumber.maxIndex).toBe(34);
      expect(result.tc3PeriodicNumber.options.length).toBe(3);
      expect(result.tc3PeriodicNumber.options[0]).toBe(12);
    });
  });

  describe('tc3PeriodicExpiryDate', () => {
    test('CreateTc3PeriodicExpiryDateElementAction', () => {
      const action: Action = new AdrDetailsActions.CreateTc3PeriodicExpiryDateElementAction('12', 12, 12);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.tc3PeriodicExpiryDate.maxIndex).toBe(24);
      expect(result.tc3PeriodicExpiryDate.options.length).toBe(2);
      expect(result.tc3PeriodicExpiryDate.options[0]).toBe(adrDetailsState.tc3PeriodicExpiryDate.options[0]);
    });
  });

  describe('productListUnNo', () => {
    test('AddArrayControlAction', () => {
      const action: Action = new AddArrayControlAction('12', 12, 12);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.productListUnNo.maxIndex).toBe(3);
      expect(result.productListUnNo.options.length).toBe(4);

    });

    test('RemoveArrayControlAction', () => {
      const action: Action = new RemoveArrayControlAction('12', 12);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.productListUnNo.maxIndex).toBe(2);
      expect(result.productListUnNo.options.length).toBe(3);
    });
  });

  describe('tankDocuments', () => {
    test('AddArrayControlAction', () => {
      const action: Action = new AdrDetailsActions.AddTankDocumentAction('12', '12');
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.tankDocuments.maxIndex).toBe(524);
      expect(result.tankDocuments.options.length).toBe(3);

    });

    test('RemoveTankDocumentAction', () => {
      const action: Action = new AdrDetailsActions.RemoveTankDocumentAction('12');
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.tankDocuments.maxIndex).toBe(523);
      expect(result.tankDocuments.options.length).toBe(1);
    });
  });

  describe('submittedValue', () => {
    test('SetSubmittedValueAction', () => {
      const action: Action = new AdrDetailsActions.SetSubmittedValueAction(adrDetailsFormModelState);
      const result = adrDetailsReducer(adrDetailsState, action);

      expect(result.submittedValue).toBe(adrDetailsFormModelState);
    });
  });
});
