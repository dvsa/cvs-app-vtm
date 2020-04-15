import { APP_MODALS } from '@app/app.enums';
import { ModalStateActions, EModalStateActions } from './modal.actions';

export interface ModalState {
  currentModal: APP_MODALS; // current suggestion
  urlToRedirect?: string;
  payload?: string;
}

export const initialModalState: ModalState = {
  currentModal: APP_MODALS.NONE,
};

export function ModalReducer(
  state: ModalState = initialModalState,
  action: ModalStateActions
): ModalState {
  switch (action.type) {
    case EModalStateActions.LoadModal: {
      return {
        ...state,
        currentModal: action.payload.currentModal,
        urlToRedirect: action.payload.urlToRedirect
      };
    }

    case EModalStateActions.ResetModal: {
      return {
        ...state,
        currentModal: APP_MODALS.NONE,
        payload: action.payload
      };
    }

    default:
      return state;
  }
}
