import { AppFormStateActions, EAppFormStateActions  } from '../actions/app-form-state.actions';

export interface AppFormState {
  pristine: boolean;
}

export const initialAppFormState: AppFormState = {
  pristine: true,
};

export function AppFormStateReducer(
  state: AppFormState = initialAppFormState,
  action: AppFormStateActions
): AppFormState {
  switch (action.type) {
    case EAppFormStateActions.SetAppFormDirty: {
      return {
        ...state,
        pristine: false
      };
    }

    case EAppFormStateActions.SetAppFormPristine: {
      return {
        ...state,
        pristine: true
      };
    }

    default:
      return state;
  }
}
