import { Action, combineReducers } from '@ngrx/store';
import { createFormGroupState, createFormStateReducerWithUpdate, FormGroupState, updateGroup, validate } from 'ngrx-forms';
import { greaterThan, required, lessThan, lessThanOrEqualTo } from 'ngrx-forms/validation';
import { approvalDate, adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import { INITIAL_STATE, IAppState } from '../state/adrDetailsForm.state';
import { SetSubmittedValueAction } from '../actions/adrDetailsForm.actions';

const formGroupReducerWithUpdate = createFormStateReducerWithUpdate<adrDetailsFormModel>(updateGroup<adrDetailsFormModel>({
  approvalDate: updateGroup<approvalDate>({
    day: validate(required, greaterThan(0), lessThanOrEqualTo(31)),
    month: validate(required, greaterThan(0), lessThanOrEqualTo(12)),
    year: validate(required, greaterThan(1970)),
  })
}));


const reducers = combineReducers<IAppState['adrDetails'], any>({
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducerWithUpdate(s, a);
  },
  submittedValue(s: adrDetailsFormModel | undefined, a: SetSubmittedValueAction) {
    switch (a.type) {
      case SetSubmittedValueAction.TYPE:
        return a.submittedValue;

      default:
        return s;
    }
  },
});


export function adrDetailsReducer(state: IAppState['adrDetails'], action: Action) {
  return reducers(state, action);
}
