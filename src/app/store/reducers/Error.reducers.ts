import { initialAppState, IAppState } from './../state/app.state';
import { ErrorActions, EErrorActions } from '../actions/Error.actions';

export function ErrorReducer(state = initialAppState.error, action: ErrorActions):
  IAppState['error'] {
  switch (action.type) {
    case EErrorActions.SetErrorMessage: {
      return action.payload;
    }

    case EErrorActions.ClearErrorMessage: {
      return null
    }

    default: return state;
  }
}
