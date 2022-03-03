import { TestBed } from '@angular/core/testing';
import { Params } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { RouterStateUrl } from './../index';
import { RouterEffects } from './router.effects';
import {
  RouterNavigationAction,
  ROUTER_NAVIGATION,
  RouterNavigationPayload
} from '@ngrx/router-store';
import { ClearErrorMessage } from '../actions/Error.actions';
import { getErrors } from '../selectors/error.selectors';
import { MockStore } from '@app/utils/';
describe('RouterEffects', () => {
  let effects: RouterEffects;
  let actions$: Observable<Action>;
  let routerNavigationAction: RouterNavigationAction<RouterStateUrl>;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterEffects,
        provideMockActions(() => actions$),
        { provide: Store, useValue: store }
      ]
    });

    routerNavigationAction = {
      type: ROUTER_NAVIGATION,
      payload: {
        routerState: {
          url: '',
          queryParams: {} as Params
        }
      } as RouterNavigationPayload<RouterStateUrl>
    };

    effects = TestBed.get(RouterEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('navigate$', () => {
    let navActionWithBack: RouterNavigationAction<RouterStateUrl>;
    beforeEach(() => {
      navActionWithBack = {
        ...routerNavigationAction,
        payload: {
          routerState: {
            url: '/search'
          }
        } as RouterNavigationPayload<RouterStateUrl>
      };
    });

    it('should dispatch ClearErrorMessage actions if exist in state', () => {
      mockSelector.next({
        getErrors: ['some error']
      });

      actions$ = hot('-a--', { a: navActionWithBack });
      const action = new ClearErrorMessage();
      const expected$ = cold('-(b)-', { b: action });

      expect(effects.navigate$).toBeObservable(expected$);
    });

    it('should return an empty stream if no errors', () => {
      mockSelector.next({
        getErrors: []
      });

      actions$ = hot('-a--', { a: navActionWithBack });

      const expected$ = cold('--');

      expect(effects.navigate$).toBeObservable(expected$);
    });
  });
});
