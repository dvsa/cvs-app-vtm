import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { clearWarning, setWarnings } from '@store/global-warning/global-warning.actions';
import { State, initialAppState } from '@store/index';
import { GlobalWarning } from '../global-warning.interface';
import { GlobalWarningService } from '../global-warning.service';

describe('GlobalWarningService', () => {
	let service: GlobalWarningService;
	let store: MockStore<State>;
	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [provideMockStore({ initialState: initialAppState })] });
		service = TestBed.inject(GlobalWarningService);
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should dispatch action setWarnings', () => {
		const expectedWarning: GlobalWarning = { warning: 'warn 2', anchorLink: '' };
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		service.setWarnings([expectedWarning]);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(setWarnings({ warnings: [expectedWarning] }));
	});

	it('should dispatch action clearError', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		service.clearWarnings();
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(clearWarning());
	});
});
