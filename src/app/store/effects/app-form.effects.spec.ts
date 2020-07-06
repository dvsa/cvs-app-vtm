import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { hot, cold } from 'jasmine-marbles';

import { SetViewState } from '../actions/VehicleTechRecordModel.actions';
import { VIEW_STATE } from '@app/app.enums';

import { AppFormEffects } from './app-form.effects';
import { SetAppFormPristine, SetAppFormDirty } from '../actions/app-form-state.actions';
import { ClearErrorMessage } from '../actions/Error.actions';
import { SetTestViewState } from '../actions/VehicleTestResultModel.actions';

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

  describe('setTechFormPristine$', () => {
    it('should dispatch SetAppFormPristine and ClearErrorMessage action if view state is set to view only', () => {
      action = new SetViewState(VIEW_STATE.VIEW_ONLY);
      actions$ = hot('-a--', { a: action });

      const appFormPristine = new SetAppFormPristine();
      const clearErrorMessage = new ClearErrorMessage();

      const expected$ = cold('-(bc)', { b: appFormPristine, c: clearErrorMessage });

      expect(effects.setTechFormPristine$).toBeObservable(expected$);
    });

    it('should return an empty stream if view state is set to edit', () => {
      action = new SetViewState(VIEW_STATE.EDIT);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('--');

      expect(effects.setTechFormPristine$).toBeObservable(expected$);
    });
  });

  describe('setTechFormDirty$', () => {
    it('should dispatch setAppFormDirty action if view state is set to edit or create', () => {
      action = new SetViewState(VIEW_STATE.EDIT);
      actions$ = hot('-a--', { a: action });

      const appFormDirty = new SetAppFormDirty();

      const expected$ = cold('-(b)', { b: appFormDirty });

      expect(effects.setTechFormDirty$).toBeObservable(expected$);
    });

    it('should return an empty stream if view state is set to view only', () => {
      action = new SetViewState(VIEW_STATE.VIEW_ONLY);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('--');

      expect(effects.setTechFormDirty$).toBeObservable(expected$);
    });
  });

  describe('setTestFormPristine$', () => {
    it('should dispatch SetAppFormPristine and ClearErrorMessage action if test view state is set to view only', () => {
      action = new SetTestViewState(VIEW_STATE.VIEW_ONLY);
      actions$ = hot('-a--', { a: action });

      const appFormPristine = new SetAppFormPristine();
      const clearErrorMessage = new ClearErrorMessage();

      const expected$ = cold('-(bc)', { b: appFormPristine, c: clearErrorMessage });

      expect(effects.setTestFormPristine$).toBeObservable(expected$);
    });

    it('should return an empty stream if view state is set to edit', () => {
      action = new SetTestViewState(VIEW_STATE.EDIT);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('--');

      expect(effects.setTestFormPristine$).toBeObservable(expected$);
    });
  });

  describe('setTestFormDirty$', () => {
    it('should dispatch setAppFormDirty action if view state is set to edit or create', () => {
      action = new SetTestViewState(VIEW_STATE.EDIT);
      actions$ = hot('-a--', { a: action });

      const appFormDirty = new SetAppFormDirty();

      const expected$ = cold('-(b)', { b: appFormDirty });

      expect(effects.setTestFormDirty$).toBeObservable(expected$);
    });

    it('should return an empty stream if view state is set to view only', () => {
      action = new SetTestViewState(VIEW_STATE.VIEW_ONLY);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('--');

      expect(effects.setTestFormDirty$).toBeObservable(expected$);
    });
  });
});
