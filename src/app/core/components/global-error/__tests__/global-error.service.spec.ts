import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { required } from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';
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
		const dispatchSpy = vi.spyOn(store, 'dispatch');
		service.addError(expectedError);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(addError(expectedError));
	});

	it('should dispatch action patchErrors', () => {
		const expectedErrors: GlobalError[] = [{ error: 'erro 2', anchorLink: '' }];
		const dispatchSpy = vi.spyOn(store, 'dispatch');
		service.patchErrors(expectedErrors);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(patchErrors({ errors: expectedErrors }));
	});

	it('should dispatch action clearError', () => {
		const dispatchSpy = vi.spyOn(store, 'dispatch');
		service.clearErrors();
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(clearError());
	});

	it('should dispatch action setErrors', () => {
		const expectedErrors: GlobalError[] = [{ error: 'erro 2', anchorLink: '' }];
		const dispatchSpy = vi.spyOn(store, 'dispatch');
		service.setErrors(expectedErrors);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(setErrors({ errors: expectedErrors }));
	});

	it('should attempt to focus all focusable controls', () => {
		const spy = vi.spyOn(document, 'querySelectorAll');
		service.focusAllControls();
		expect(spy).toHaveBeenCalled();
	});

	it('extracts signal validation messages and recognises signal controls as leaves', () => {
		const control = TestBed.runInInjectionContext(
			() => new SignalFormControl('', (path) => required(path, { message: 'Enter a value' }))
		);
		const form = new FormGroup({ field: control });

		expect(service.extractGlobalErrors(form)).toEqual([
			{ error: 'Enter a value', anchorLink: 'field', accordion: undefined },
		]);
		expect(service.extractErrors(control)).toEqual(control.errors);
	});

	it('preserves reactive error strings, metadata and array errors', () => {
		const form = new FormGroup({
			text: new FormControl('', () => ({ required: 'Enter text' })),
			object: new FormControl('', () => ({
				required: { error: 'Enter a value', anchorLink: 'custom-anchor', accordion: 'section' },
			})),
			list: new FormControl('', () => ({
				items: [{ error: 'First item' }, { error: 'Second item', anchorLink: 'second' }],
			})),
		});

		expect(service.extractGlobalErrors(form)).toEqual([
			{ error: 'Enter text', anchorLink: 'text', accordion: undefined },
			{ error: 'Enter a value', anchorLink: 'custom-anchor', accordion: 'section' },
			{ error: 'First item', anchorLink: 'list', accordion: undefined },
			{ error: 'Second item', anchorLink: 'second', accordion: undefined },
		]);
	});

	it('reports a validation error that has no displayable message', () => {
		const form = new FormGroup({
			field: new FormControl('', () => ({ custom: { kind: 'custom' } })),
		});
		expect(() => service.extractGlobalErrors(form)).toThrow('Validation error does not contain a message');
	});
});
