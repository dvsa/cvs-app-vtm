import { ELoadingActions, LoadingActions, LoadingFalse, LoadingTrue } from '../actions/Loader.actions';
import { initialLoaderState } from '../state/Loader.state';
import { LoaderReducer } from './Loader.reducers';

describe('LoaderReducer', () => {
  describe('AppIsLoading', () => {
    test('should set loading state to true', () => {
      const action = new LoadingTrue();
      const result = LoaderReducer(initialLoaderState, action);

      expect(result).toEqual({ ...initialLoaderState, loading: true });
    });
  });

  describe('AppIsNotLoading', () => {
    test('should set loading state to false', () => {
      const action = new LoadingFalse();
      const result = LoaderReducer(initialLoaderState, action);

      expect(result).toEqual({ ...initialLoaderState, loading: false });
    });
  });

  describe('default reducer', () => {
    test('should return the initial state if no valid action was dispatcher', () => {
      const action = <LoadingActions>{ type: <ELoadingActions>'ELoadingActions' };
      const result = LoaderReducer(undefined, action);

      expect(result).toEqual({ ...initialLoaderState });
    });
  });
});
