import { getCurrentModalState, getModalPayload } from './modal.selectors';
import { initialModalState, ModalState } from './modal.reducer';

import { APP_MODALS } from '../app.enums';

describe('modal selectors', () => {
  let modalState: ModalState;

  beforeEach(() => {
    modalState = { currentModal: APP_MODALS.NONE };
  });

  describe('getCurrentModalState', () => {
    it('should return the default state on initialization', () => {
      modalState = {
        ...modalState,
        currentModal: APP_MODALS.NONE
      } as ModalState;
      expect(getCurrentModalState.projector(initialModalState)).toEqual(modalState);
    });

    it('should return updated modalState', () => {
      modalState = { ...modalState, currentModal: APP_MODALS.LOSE_CHANGES };
      expect(getCurrentModalState.projector(modalState)).toEqual(modalState);
    });
  });
});
