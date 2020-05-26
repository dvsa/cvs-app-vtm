import { LoadModal, EModalStateActions, ResetModal, RedirectModal } from './modal.actions';
import { APP_MODALS } from '@app/app.enums';
import { ModalState } from './modal.reducer';

describe('ModalState actions', () => {
  it('should create LoadModal action', () => {
    const modalState = {currentModal: APP_MODALS.LOSE_CHANGES, currentRoute: '/some/route'} as ModalState;
    const action = new LoadModal(modalState);
    expect({ ...action }).toEqual({
      type: EModalStateActions.LoadModal,
      payload: modalState
    });
  });

  it('should create ResetModal action', () => {
    const action = new ResetModal();

    expect({ ...action }).toEqual({
      type: EModalStateActions.ResetModal,
    });
  });

  it('should create RedirectModal action', () => {
    const action = new RedirectModal();

    expect({ ...action }).toEqual({
      type: EModalStateActions.RedirectModal,
    });
  });
});
