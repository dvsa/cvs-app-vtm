import { initialReferenceDataState } from '@app/store/state/ReferenceDataState.state';
import {
  EReferenceDataActions,
  ReferenceDataActions
} from '@app/store/actions/ReferenceData.actions';

export function ReferenceDataReducers(
  state = initialReferenceDataState,
  action: ReferenceDataActions
) {
  switch (action.type) {
    case EReferenceDataActions.LoadPreparersSuccess: {
      return {
        ...state,
        preparers: action.preparers
      };
    }

    case EReferenceDataActions.LoadTestStationsSuccess: {
      return {
        ...state,
        testStations: action.testStations
      };
    }

    case EReferenceDataActions.LoadTestTypeCategoriesSuccess: {
      return {
        ...state,
        testTypeCategories: action.testTypeCategories
      };
    }

    default:
      return state;
  }
}
