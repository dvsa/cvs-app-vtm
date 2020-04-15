import { Store } from '@ngrx/store';
import { selectFeature, selectSearchPageError } from '../selectors/searchPage.selectors';
import { async, TestBed } from '@angular/core/testing';

describe('searchPage selector', () => {

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
      expect(selectFeature({ error: 'test' })).toEqual('test');
    });
  });

  describe('selectSearchPageError', () => {
    it('should return null if store empty', () => {
      const state = selectFeature({ error: 'test error', state: null });
      expect(selectSearchPageError(state)).toEqual(null);
    });

    it('should return undefined if state undefined', () => {
      const state = { error: 'test error', state: undefined };
      expect(selectSearchPageError(state)).toEqual(undefined);
    });
  });
});
