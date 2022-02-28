import { LoadModal, EModalStateActions, ChangeView, ResetModal } from './modal.actions';
import { APP_MODALS } from '@app/app.enums';
import { ModalState } from './modal.reducer';

describe('ModalState actions', () => {
  it('should create LoadModal action', () => {
    const modalState = {
      currentModal: APP_MODALS.LOSE_CHANGES,
      currentRoute: '/some/route'
    } as ModalState;
    const action = new LoadModal(modalState);
    expect({ ...action }).toEqual({
      type: EModalStateActions.LoadModal,
      payload: modalState
    });
  });

  it('should create ResetModal action', () => {
    const action = new ResetModal();

    expect({ ...action }).toEqual({
      type: EModalStateActions.ResetModal
    });
  });

  it('should create ChangeView action', () => {
    const urlToRedirect = '/some/route';
    const action = new ChangeView(urlToRedirect);

    expect({ ...action }).toEqual({
      type: EModalStateActions.ChangeView,
      urlToRedirect: urlToRedirect
    });
  });
});
