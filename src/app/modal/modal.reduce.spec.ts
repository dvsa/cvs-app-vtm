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
    it('should set the error(s) to the state', () => {
      action = new LoadModal({ currentModal: APP_MODALS.NONE, currentRoute: 'someRoute' });
      state = {
        currentModal: APP_MODALS.NONE,
        currentRoute: ''
      };

      resultState = ModalReducer(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });

  describe('ResetModal', () => {
    it('should clear error(s) from the state', () => {
      action = new ResetModal('someUrl');
      state = {
        currentModal: APP_MODALS.LOSE_CHANGES,
        currentRoute: ''
      };

      resultState = ModalReducer(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });
});
