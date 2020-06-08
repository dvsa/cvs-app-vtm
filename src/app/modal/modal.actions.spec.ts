import { LoadModal, EModalStateActions, ChangeView } from './modal.actions';
import { APP_MODALS } from '@app/app.enums';
import { ModalState } from './modal.reducer';

describe('ModalState actions', () => {
  let modalState: ModalState;
  beforeEach(() => {
    modalState = {
      currentModal: APP_MODALS.LOSE_CHANGES,
      currentRoute: '/some/route'
    } as ModalState;
  });

  it('should create LoadModal action', () => {
    const action = new LoadModal(modalState);
    expect({ ...action }).toEqual({
      type: EModalStateActions.LoadModal,
      payload: modalState
    });
  });

  it('should create ChangeView action', () => {
    const action = new ChangeView(modalState);

    expect({ ...action }).toEqual({
      type: EModalStateActions.ChangeView,
      payload: modalState
    });
  });
});
