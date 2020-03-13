import {createFeatureSelector, createSelector, Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import { RouterStateUrl } from '@app/shared/utils';
import {selectReducerState, getRouterInfo } from '@app/store/selectors/route.selectors';


describe('route selector', () => {

  describe('selectFeature', () => {

    it('should select reducer state', () => {
      expect(selectReducerState({'router' : 'test'})).toEqual('test');
    });

  });

  describe('selectSearchPageError', () => {

    it('should get router info using reducer state', () => {
      const reducerState = { 'router': 'test', 'state': undefined};
      expect(getRouterInfo(reducerState)).toEqual(undefined);
    });

  });


});
