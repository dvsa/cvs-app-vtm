import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { CancelEditTestGuard } from './cancel-edit-test.guard';

const mockRoute = {} as unknown as ActivatedRouteSnapshot;
const mockRouteState = {} as unknown as RouterStateSnapshot;

describe('cancelEditTestGuard', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })],
    });

    store = TestBed.inject(MockStore);
  });

  it('should return true', () => {
    TestBed.runInInjectionContext(() => {
      expect(CancelEditTestGuard(mockRoute, mockRouteState)).toBe(true);
    });
  });

  it('should dispatch the updateEditingTechRecordCancel action', () => {
    TestBed.runInInjectionContext(() => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      void CancelEditTestGuard(mockRoute, mockRouteState);
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
