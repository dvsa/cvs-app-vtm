import { Action } from '@ngrx/store';

import { ModalState, initialModalState, ModalReducer } from './modal.reducer';
import { LoadModal, ResetModal } from './modal.actions';
import { APP_MODALS } from '../app.enums';

describe('ModalReducer', () => {
  let state: ModalState;
  let resultState: ModalState;
  let action: any;

  describe('when initialised', () => {
    beforeEach(() => {
      action = {} as Action;
      const initState: ModalState = initialModalState;
      resultState = ModalReducer(initState, action);
    });

    it('should set the default state', () => {
      expect(resultState).toMatchSnapshot();
    });
  });

  describe('LoadModal', () => {
    it('should set the current modal to lose changes', () => {
      action = new LoadModal({ currentModal: APP_MODALS.LOSE_CHANGES });
      state = {
        currentModal: APP_MODALS.LOSE_CHANGES
      };

      resultState = ModalReducer(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });

  describe('ResetModal', () => {
    it('should set current modal to none from the state', () => {
      action = new ResetModal();
      state = {
        currentModal: APP_MODALS.NONE
      };

      resultState = ModalReducer(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });
});
