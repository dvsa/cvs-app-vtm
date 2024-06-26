import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { TechRecordComponent } from 'src/app/features/tech-record/tech-record.component';
import { CancelEditTechActivateGuard, CancelEditTechDeactivateGuard } from './cancel-edit-tech.guard';

const mockRoute = {} as unknown as ActivatedRouteSnapshot;
const mockRouteState = {} as unknown as RouterStateSnapshot;

describe('CancelEditTechGuard', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })],
    });

    store = TestBed.inject(MockStore);
  });
  describe('CancelEditTechActivateGuard', () => {

    it('should return true', () => {
      TestBed.runInInjectionContext(() => {
        expect(CancelEditTechActivateGuard(mockRoute, mockRouteState)).toBe(true);
      });
    });

    it('should dispatch the updateEditingTechRecordCancel action', () => {
      TestBed.runInInjectionContext(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        void CancelEditTechActivateGuard(mockRoute, mockRouteState);
        expect(dispatchSpy).toHaveBeenCalled();
      });
    });
  });

  describe('CancelEditTechDeactivateGuard', () => {
    const component = {} as unknown as TechRecordComponent;

    it('should return true', () => {
      TestBed.runInInjectionContext(() => {
        expect(CancelEditTechDeactivateGuard(component, mockRoute, mockRouteState, mockRouteState)).toBe(true);
      });
    });

    it('should dispatch the updateEditingTechRecordCancel action', () => {
      TestBed.runInInjectionContext(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        void CancelEditTechDeactivateGuard(component, mockRoute, mockRouteState, mockRouteState);
        expect(dispatchSpy).toHaveBeenCalled();
      });
    });
  });
});
