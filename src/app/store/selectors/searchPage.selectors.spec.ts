import {createSelector, createFeatureSelector, Store, INITIAL_STATE} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {
  selectFeature,
  selectSearchPageError
} from '../selectors/searchPage.selectors';
import {async, TestBed} from '@angular/core/testing';
import {getRouterInfo} from '@app/store/selectors/route.selectors';


describe('searchPage selector', () => {

  let store: Store<IAppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: {
            error: 'testing test'
          }
        }
      ]
    }).compileComponents();
  }));

  describe('selectFeature', () => {

    it('should create error state', () => {
      expect(selectFeature({'error' : 'test'})).toEqual('test');
    });

  });

  describe('selectSearchPageError', () => {

    it('should return null if store empty', () => {
      const state = selectFeature({'error' : 'test error', 'state': null});
      expect(selectSearchPageError(state)).toEqual(null);
    });

    it('should return undefined if state undefined', () => {
      const state = {'error' : 'test error', 'state': undefined};
      expect(selectSearchPageError(state)).toEqual(undefined);
    });

  });

});
