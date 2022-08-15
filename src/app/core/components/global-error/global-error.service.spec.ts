import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { addError, clearError } from '@store/global-error/actions/global-error.actions';
import { GlobalError } from './global-error.interface';
import { GlobalErrorService } from './global-error.service';

describe('GlobalErrorService', () => {
  let service: GlobalErrorService;
  let store: MockStore<State>;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({ initialState: initialAppState })] });
    service = TestBed.inject(GlobalErrorService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch action addError', () => {
    const extraError: GlobalError = { error: 'erro 2', anchorLink: '' };
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    service.addError(extraError);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(addError(extraError));
  });

  it('should dispatch action clearError', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    service.clearErrors();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(clearError());
  });
});
