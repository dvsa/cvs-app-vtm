import {
  EAppFormStateActions,
  SetAppFormDirty,
  SetAppFormPristine
} from './app-form-state.actions';

describe('AppFormState actions', () => {
  it('should create SetAppFormDirty action', () => {
    const action = new SetAppFormDirty();
    expect({ ...action }).toEqual({
      type: EAppFormStateActions.SetAppFormDirty
    });
  });

  it('should create SetAppFormPristine action', () => {
    const action = new SetAppFormPristine();

    expect({ ...action }).toEqual({
      type: EAppFormStateActions.SetAppFormPristine
    });
  });
});
