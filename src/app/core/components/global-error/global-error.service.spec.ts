import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { addError, clearError, patchErrors } from '@store/global-error/actions/global-error.actions';
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
    const expectedError: GlobalError = { error: 'erro 2', anchorLink: '' };
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    service.addError(expectedError);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(addError(expectedError));
  });

  it('should dispatch action patchErrors', () => {
    const expectedErrors: GlobalError[] = [{ error: 'erro 2', anchorLink: '' }];
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    service.patchErrors(expectedErrors);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(patchErrors({ errors: expectedErrors }));
  });

  it('should dispatch action clearError', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    service.clearErrors();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(clearError());
  });
});
