import { ELoadingActions, LoadingFalse, LoadingTrue } from './Loader.actions';

describe('LoadingActions', () => {
  test('LoadingTrue', () => {
    expect(new LoadingTrue().type).toBe(ELoadingActions.AppIsLoading);
  });

  test('LoadingFalse', () => {
    expect(new LoadingFalse().type).toBe(ELoadingActions.AppIsNotLoading);
  });
});
