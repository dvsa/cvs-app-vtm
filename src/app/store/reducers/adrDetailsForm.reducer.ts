import { Action, combineReducers } from '@ngrx/store';
import { createFormGroupState, createFormStateReducerWithUpdate, FormGroupState, updateGroup, validate, addGroupControl, setValue } from 'ngrx-forms';
import { greaterThan, required, lessThan, lessThanOrEqualTo } from 'ngrx-forms/validation';
import { approvalDate, adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import { INITIAL_STATE, IAppState } from '../state/adrDetailsForm.state';
import { SetSubmittedValueAction, CreatePermittedDangerousGoodElementAction, RemovePermittedDangerousGoodElementAction, CreateGuidanceNoteElementAction, RemoveGuidanceNoteElementAction } from '../actions/adrDetailsForm.actions';

const formGroupReducerWithUpdate = createFormStateReducerWithUpdate<adrDetailsFormModel>(updateGroup<adrDetailsFormModel>({
  approvalDate: updateGroup<approvalDate>({
    day: validate(required, greaterThan(0), lessThanOrEqualTo(31)),
    month: validate(required, greaterThan(0), lessThanOrEqualTo(12)),
    year: validate(required, greaterThan(1970)),
  })
}));


const reducers = combineReducers<IAppState['adrDetails'], any>({
  formState(
    s = INITIAL_STATE,
    a: CreatePermittedDangerousGoodElementAction | RemovePermittedDangerousGoodElementAction | CreateGuidanceNoteElementAction | RemoveGuidanceNoteElementAction
  ) {
    s = formGroupReducerWithUpdate(s, a);

    switch (a.type) {
      case CreatePermittedDangerousGoodElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          permittedDangerousGoods: group => {
            const newGroup = addGroupControl(group, a.name, false);

            // alternatively we can also use setValue
            // const newValue = { ...group.value, [a.name]: false };
            // const newGroup = setValue(group, newValue);

            return newGroup;
          },
        })(s);

      case RemovePermittedDangerousGoodElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          permittedDangerousGoods: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            const newGroup = setValue(group, newValue);

            // alternatively we can also use removeGroupControl
            // const newGroup = removeGroupControl(group, a.name);

            return newGroup;
          },
        })(s);

      case CreateGuidanceNoteElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          additionalNotes: group => {
            const newGroup = addGroupControl(group, a.name, false);

            // alternatively we can also use setValue
            // const newValue = { ...group.value, [a.name]: false };
            // const newGroup = setValue(group, newValue);

            return newGroup;
          },
        })(s);

      case RemoveGuidanceNoteElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          additionalNotes: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            const newGroup = setValue(group, newValue);

            // alternatively we can also use removeGroupControl
            // const newGroup = removeGroupControl(group, a.name);

            return newGroup;
          },
        })(s);

      default:
        return s;
    }
  },
  permittedDangerousGoodsOptions(
    s: string[] = ['Danger Option 1', 'Danger Option 2'],
    a: CreatePermittedDangerousGoodElementAction | RemovePermittedDangerousGoodElementAction
  ) {
    // console.log(`inside reducer permittedDangerousGoodsOptions s => ${JSON.stringify(s)}, a => ${JSON.stringify(a)}`);
    switch (a.type) {
      case CreatePermittedDangerousGoodElementAction.TYPE:
        return [...s, a.name];

      case RemovePermittedDangerousGoodElementAction.TYPE:
        return s.filter(i => i !== a.name);

      default:
        return s;
    }
  },
  additionalNotesOptions(
    s: string[] = ['Document Option 1', 'Document Option 2'],
    a: CreateGuidanceNoteElementAction | RemoveGuidanceNoteElementAction
  ) {
    // console.log(`inside reducer additionalNotesOptions s => ${JSON.stringify(s)}, a => ${JSON.stringify(a)}`);
    switch (a.type) {
      case CreateGuidanceNoteElementAction.TYPE:
        return [...s, a.name];

      case RemoveGuidanceNoteElementAction.TYPE:
        return s.filter(i => i !== a.name);

      default:
        return s;
    }
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
