import { ErrorActions, EErrorActions } from '../actions/Error.actions';

export interface ErrorState {
  errors: string[];
}

export const initialErrorState: ErrorState = {
  errors: []
};

export function ErrorReducer(
  state: ErrorState = initialErrorState,
  action: ErrorActions
): ErrorState {
  switch (action.type) {
    case EErrorActions.SetErrorMessage: {
      return {
        ...state,
        errors: [...action.payload]
      };
    }

    case EErrorActions.ClearErrorMessage: {
      return {
        ...state,
        errors: []
      };
    }

    default:
      return state;
  }
}
