import { TestBed } from '@angular/core/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { resultOfTestSelector } from '@store/test-records';
import { ResultOfTestService } from '../result-of-test.service';

describe('ResultOfTestService', () => {
	let service: ResultOfTestService;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ResultOfTestService, provideMockStore({ initialState: initialAppState })],
		});
		service = TestBed.inject(ResultOfTestService);
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should dispatch the action to update the result of the test', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		service.updateResultOfTest();
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
	});

	it('should get the result from the selector', (done) => {
		store.overrideSelector(resultOfTestSelector, TestResults.PASS);
		service.resultOfTest.subscribe((result) => {
			expect(result).toBe(TestResults.PASS);
			done();
		});
	});
});
