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
import {
  RouterNavigationAction,
  ROUTER_NAVIGATION,
  RouterNavigationPayload
} from '@ngrx/router-store';

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
  let action: Action;

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
    it('should dispatch SetViewState action if current view state is in edit state', () => {
      const navActionWithBack: RouterNavigationAction<RouterStateUrl> = {
        ...routerNavigationAction,
        payload: {
          routerState: {
            url: '/search'
          }
        } as RouterNavigationPayload<RouterStateUrl>
      };

      mockSelector.next({
        getViewState: VIEW_STATE.EDIT
      });

      actions$ = hot('-a--', { a: navActionWithBack });
      action = new SetViewState(VIEW_STATE.VIEW_ONLY);
      const expected$ = cold('-(b)-', { b: action });

      expect(effects.navigate$).toBeObservable(expected$);
    });

    it('should return an empty stream if current view state is VIEW_ONLY', () => {
      action = new SetViewState(VIEW_STATE.VIEW_ONLY);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('--');

      expect(effects.navigate$).toBeObservable(expected$);
    });
  });
});
