import { APP_MODALS } from '@app/app.enums';
import { ModalStateActions, EModalStateActions } from './modal.actions';

export interface ModalState {
  currentModal: APP_MODALS;
  currentRoute: string;
}

export const initialModalState = null;

export function ModalReducer(
  state: ModalState = initialModalState,
  action: ModalStateActions
): ModalState {
  switch (action.type) {
    case EModalStateActions.LoadModal: {
      return {
        ...state,
        currentModal: action.payload.currentModal,
        currentRoute: action.payload.currentRoute
      };
    }

    default:
      return state;
  }
}
