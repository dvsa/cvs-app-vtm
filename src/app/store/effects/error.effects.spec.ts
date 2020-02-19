import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { hot, cold } from 'jasmine-marbles';

import { ErrorEffects } from './error.effects';
import { SetViewState } from './../actions/VehicleTechRecordModel.actions';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '../actions/Error.actions';

describe('ErrorEffects', () => {
  let effects: ErrorEffects;
  let actions$: Observable<Action>;

  let action: Action;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.get(ErrorEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('clearSummaryErrors$', () => {
    it('should dispatch ClearErrorMessage action if view state is set to view only', () => {
      action = new SetViewState(VIEW_STATE.VIEW_ONLY);
      actions$ = hot('-a--', { a: action });

      const clearErrorAction = new ClearErrorMessage();
      const expected$ = cold('-(b)-', { b: clearErrorAction });

      expect(effects.clearSummaryErrors$).toBeObservable(expected$);
    });

    it('should return an empty stream if view state is set to edit', () => {
      action = new SetViewState(VIEW_STATE.EDIT);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('--');

      expect(effects.clearSummaryErrors$).toBeObservable(expected$);
    });
  });
});
