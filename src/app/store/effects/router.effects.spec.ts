import { TestBed } from '@angular/core/testing';
import { Params } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { hot, cold } from 'jasmine-marbles';

import { RouterStateUrl } from './../index';
import { RouterEffects } from './router.effects';
import { VIEW_STATE } from './../../app.enums';
import { getViewState } from '../selectors/VehicleTechRecordModel.selectors';
import { SetViewState } from '../actions/VehicleTechRecordModel.actions';
import { getErrors } from '../selectors/error.selectors';
import {
  RouterNavigationAction,
  ROUTER_NAVIGATION,
  RouterNavigationPayload
} from '@ngrx/router-store';
import { ClearErrorMessage } from '../actions/Error.actions';

const mockSelector = new BehaviorSubject<any>(undefined);

class MockStore {
  select(selector: any) {
    switch (selector) {
      case getViewState:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getViewState') ? value['getViewState'] : {}
          )
        );
      case getErrors:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getErrors') ? value['getErrors'] : []
          )
        );
      default:
        return mockSelector;
    }
  }

  dispatch(action: Action) {
    return [];
  }
}

describe('RouterEffects', () => {
  let effects: RouterEffects;
  let actions$: Observable<Action>;
  let routerNavigationAction: RouterNavigationAction<RouterStateUrl>;

  const store: MockStore = new MockStore();

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

    it('should dispatch SetViewState and ClearErrorMessage actions if exist in state', () => {
      mockSelector.next({
        getViewState: VIEW_STATE.EDIT,
        getErrors: ['error1', 'error2']
      });

      actions$ = hot('-a--', { a: navActionWithBack });
      const viewStateAction = new SetViewState(VIEW_STATE.VIEW_ONLY);
      const clearErrorAction = new ClearErrorMessage();

      const expected$ = cold('-(bc)', { b: viewStateAction, c: clearErrorAction });

      expect(effects.navigate$).toBeObservable(expected$);
    });

    it('should return an empty stream if VIEW_ONLY and no errors', () => {
      mockSelector.next({
        getViewState: VIEW_STATE.VIEW_ONLY,
        getErrors: []
      });

      actions$ = hot('-a--', { a: navActionWithBack });

      const expected$ = cold('--');

      expect(effects.navigate$).toBeObservable(expected$);
    });
  });
});
