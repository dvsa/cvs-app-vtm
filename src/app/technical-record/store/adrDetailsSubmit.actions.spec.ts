import { SubmitAdrAction, SubmitAdrActionSuccess, SubmitAdrActionFailure } from './adrDetailsSubmit.actions';

describe('SubmitAdrAction', () => {
  test('should create an instance of SubmitAdrAction', () => {
    expect(new SubmitAdrAction('TYPE')).toBeTruthy();
  });

  test('should have the right type', () => {
    expect(new SubmitAdrAction('TYPE').type).toBe('adrDetails/SUBMIT_ADR_ACTION');
  });

  test('should have the right submit context', () => {
    expect(new SubmitAdrAction('TYPE').submitContext).toBe('TYPE');
  });
});

describe('SubmitAdrActionSuccess', () => {
  test('should create an instance of SubmitAdrActionSuccess', () => {
    expect(new SubmitAdrAction('TYPE')).toBeTruthy();
  });

  test('should have the right type', () => {
    expect(new SubmitAdrActionSuccess('payload').type).toBe('adrDetails/SUBMIT_ADR_ACTION_SUCCESS');
  });

  test('should have the right payload', () => {
    expect(new SubmitAdrActionSuccess('payload').payload).toBe('payload');
  });
});

describe('SubmitAdrActionFailure', () => {
  test('should create an instance of SubmitAdrActionFailure', () => {
    expect(new SubmitAdrActionFailure('TYPE')).toBeTruthy();
  });

  test('should have the right type', () => {
    expect(new SubmitAdrActionFailure('TYPE').type).toBe('adrDetails/SUBMIT_ADR_ACTION_FAILURE');
  });

  test('should have the right payload', () => {
    expect(new SubmitAdrActionFailure('payload').payload).toBe('payload');
  });
});