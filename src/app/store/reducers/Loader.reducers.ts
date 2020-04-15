import { LoadingActions, ELoadingActions } from './../actions/Loader.actions';
import { initialLoaderState, ILoaderState } from '../state/Loader.state';

export function LoaderReducer(state = initialLoaderState, action: LoadingActions):
  ILoaderState {
  switch (action.type) {
    case ELoadingActions.AppIsLoading: {
      return {
        ...state,
        loading: true,
      };
    }

    case ELoadingActions.AppIsNotLoading: {
      return {
        ...state,
        loading: false,
      };
    }

    default: return state;
  }
}
