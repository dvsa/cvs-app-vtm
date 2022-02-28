import { APP_MODALS } from '../app.enums';

export interface ModalContent {
  modal: APP_MODALS;
  status: boolean;
  payload?: string; // TODO: change to union type if other modals need to pass different value in future.
}

export interface ModalPayload {
  isOk: boolean;
  payload?: string; // TODO: Replace with union type when other modals are implemented
}
