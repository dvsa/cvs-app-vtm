import { APP_MODALS } from '../app.enums';

export interface ModalContent {
  modal: APP_MODALS;
  status: boolean;
  payload?: any;
  urlToRedirect: string;
}
