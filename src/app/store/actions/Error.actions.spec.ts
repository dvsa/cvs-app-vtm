import { ClearErrorMessage, EErrorActions, SetErrorMessage } from './Error.actions';

describe('ErrorActions', () => {
  it('should create SetErrorMessage action', () => {
    const errorMessages = ['error1', 'error2'];
    const action = new SetErrorMessage(errorMessages);

    expect({ ...action }).toEqual({
      type: EErrorActions.SetErrorMessage,
      payload: errorMessages
    });
  });

  it('should create ClearErrorMessage action', () => {
    const action = new ClearErrorMessage();

    expect({ ...action }).toEqual({
      type: EErrorActions.ClearErrorMessage
    });
  });
});
