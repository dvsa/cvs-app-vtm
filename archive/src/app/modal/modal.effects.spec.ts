import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { ModalEffects } from './modal.effects';
import { ChangeView, ResetModal } from './modal.actions';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore } from '@app/utils/mockStore';
import { getCurrentModalState } from './modal.selectors';
import { APP_MODALS } from '../app.enums';
import { ModalState } from './modal.reducer';
import { SetAppFormPristine } from '../store/actions/app-form-state.actions';

describe('ModalEffects', () => {
  let effects: ModalEffects;
  let actions$: Observable<Action>;
  let navigateByUrl: jest.Mock;
  let action: Action;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(() => {
    navigateByUrl = jest.fn();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        ModalEffects,
        provideMockActions(() => actions$),
        { provide: Store, useValue: store },
        { provide: Router, useValue: { navigateByUrl } }
      ]
    });

    effects = TestBed.get(ModalEffects);
  });

  describe('resetModal$', () => {
    it('should call SetAppFormPristine and ChangeView action', () => {
      mockSelector.next({
        getCurrentModalState: {
          currentModal: APP_MODALS.NONE,
          urlToRedirect: 'some/url',
          payload: 'some value'
        } as ModalState
      });
      const url = 'some/url';
      action = new ResetModal();
      actions$ = hot('-a--', { a: action });

      const appPristineAction = new SetAppFormPristine();
      const changeViewAction = new ChangeView(url);

      const expected$ = cold('-(bc)', { b: appPristineAction, c: changeViewAction });

      expect(effects.resetModal$).toBeObservable(expected$);
    });
  });

  describe('changeView$', () => {
    it('should navigate to the proivded url', () => {
      const url = 'some/url';
      action = new ChangeView(url);
      actions$ = hot('-a--', { a: action });

      const expected$ = cold('-(c)--', {
        c: undefined
      });

      expect(effects.changeView$).toBeObservable(expected$);

      expect(navigateByUrl).toHaveBeenCalledWith(url);
    });
  });
});
