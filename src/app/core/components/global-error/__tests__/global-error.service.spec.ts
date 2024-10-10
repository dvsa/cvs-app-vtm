import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addError, clearError, patchErrors, setErrors } from '@store/global-error/global-error.actions';
import { State, initialAppState } from '@store/index';
import { GlobalError } from '../global-error.interface';
import { GlobalErrorService } from '../global-error.service';

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

	it('should dispatch action setErrors', () => {
		const expectedErrors: GlobalError[] = [{ error: 'erro 2', anchorLink: '' }];
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		service.setErrors(expectedErrors);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(setErrors({ errors: expectedErrors }));
	});

	it('should attempt to focus all focusable controls', () => {
		const spy = jest.spyOn(document, 'querySelectorAll');
		service.focusAllControls();
		expect(spy).toHaveBeenCalled();
	});
});
