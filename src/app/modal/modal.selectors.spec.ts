import { getCurrentModalState } from './modal.selectors';
import { initialModalState, ModalState } from './modal.reducer';

import { APP_MODALS } from '../app.enums';

describe('modal selectors', () => {
  let modalState: ModalState;

  beforeEach(() => {
    modalState = { currentModal: APP_MODALS.LOSE_CHANGES, currentRoute: 'some_route' };
  });

  describe('getCurrentModalState', () => {
    it('should return the default state on initialization', () => {
      modalState = { ...modalState, currentModal: APP_MODALS.NONE, currentRoute: '' } as ModalState;
      expect(getCurrentModalState.projector(initialModalState)).toEqual(modalState);
    });

    it('should return updated modalState', () => {
      expect(getCurrentModalState.projector(modalState)).toEqual(modalState);
    });
  });
});
