import {
  ClearErrorMessage, EErrorActions, SetErrorMessage
} from './Error.actions';

describe('ErrorActions', () => {
  test('SetErrorMessage', () => {
    const action = new SetErrorMessage('test');

    expect(action.payload).toBe('test');
    expect(action.type).toBe(EErrorActions.SetErrorMessage);
  });

  test('ClearErrorMessage', () => {
    const action = new ClearErrorMessage();

    expect(action.type).toBe(EErrorActions.ClearErrorMessage);
  });
});
