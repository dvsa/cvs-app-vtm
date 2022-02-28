import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { hot, cold } from 'jasmine-marbles';

import { SetViewState } from '../actions/VehicleTechRecordModel.actions';
import { VIEW_STATE } from '@app/app.enums';

import { AppFormEffects } from './app-form.effects';
import { SetAppFormPristine } from '../actions/app-form-state.actions';
import { ClearErrorMessage } from '../actions/Error.actions';

describe('AppFormEffects', () => {
  let effects: AppFormEffects;
  let actions$: Observable<Action>;

  let action: Action;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppFormEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.get(AppFormEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('setAppFormPristine$', () => {
    it('should dispatch SetAppFormPristine action if view state is set to view only', () => {
      action = new SetViewState(VIEW_STATE.VIEW_ONLY);
      actions$ = hot('-a--', { a: action });

      const appFormPristine = new SetAppFormPristine();
      const clearErrorMessage = new ClearErrorMessage();

      const expected$ = cold('-(bc)', { b: appFormPristine, c: clearErrorMessage });

      expect(effects.setAppFormPristine$).toBeObservable(expected$);
    });

    it('should return an empty stream if view state is set to edit', () => {
      action = new SetViewState(VIEW_STATE.EDIT);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('--');

      expect(effects.setAppFormPristine$).toBeObservable(expected$);
    });
  });
});
