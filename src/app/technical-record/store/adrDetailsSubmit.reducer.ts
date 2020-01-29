import { initialAdrDetailsSubmitState, IAdrDetailsSubmitState } from "./adrDetailsSubmit.state";
import { SubmitAdrAction, SubmitAdrActionFailure, SubmitAdrActionSuccess } from "./adrDetailsSubmit.actions";

export function AdrDetailsSubmitReducer(state = initialAdrDetailsSubmitState,
    action: SubmitAdrAction | SubmitAdrActionSuccess | SubmitAdrActionFailure): IAdrDetailsSubmitState {
  switch (action.type) {
    case SubmitAdrAction.TYPE: {
      return {
        ...state,
        context: action.submitContext,
        error: null // clear error message
      };
    }

    // case SubmitAdrActionSuccess.TYPE: {
    //   return {
    //     ...state,
    //     adrDetailsPayload: action.payload,
    //     error: null // clear error message
    //   };
    // }

    case SubmitAdrActionFailure.TYPE: {
      return {
        ...state,
        error: action.payload  // capture error message
      };
    }

    default:
      return state;
  }
}
