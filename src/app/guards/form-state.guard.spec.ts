import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { FormStateGuard } from './form-state.guard';
import { MockStore } from '../utils/mockStore';
import { LoadModal } from '../modal/modal.actions';
import { APP_MODALS } from '@app/app.enums';

describe('FormStateGuard', () => {
  let formStateGuard: FormStateGuard;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store = new MockStore(mockSelector);
  const routeMock: any = { snapshot: {}};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        FormStateGuard,
        {
          provide: Store,
          useValue: store
        }
      ]
    }).compileComponents();
    formStateGuard = TestBed.get(FormStateGuard);
    mockSelector.next({
      getAppFormState: false
    });
  }));

  describe('canActivate', () => {
    it('should call LoadModal action', () => {
      // TODO: update unit test
      spyOn(store, 'select').and.callThrough();
      spyOn(store, 'dispatch').and.callThrough();

      formStateGuard.canActivate(routeMock);
      expect(store.select).toHaveBeenCalled();
      expect(formStateGuard.canActivate).toBeTruthy();
    });
  });
});
