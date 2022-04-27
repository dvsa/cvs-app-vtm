import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { GlobalError, GlobalErrorService } from './global-error.service';

describe('GlobalErrorService', () => {
  let service: GlobalErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({ initialState: initialAppState })] });
    service = TestBed.inject(GlobalErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get and set errors array', () => {
    const errors: GlobalError[] = [{ message: 'erro 1', anchorLink: '' }];
    service.errors = errors;
    expect(service.errors).toEqual(errors);
  });

  it('should add errors to existing array', () => {
    const errors: GlobalError[] = [{ message: 'erro 1', anchorLink: '' }];
    const extraError: GlobalError = { message: 'erro 2', anchorLink: '' };
    service.errors = errors;
    service.addError(extraError);
    expect(service.errors).toEqual([...errors, extraError]);
  });
});
