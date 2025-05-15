import { TestBed } from '@angular/core/testing';
import { Log, LogType } from '@models/logs/logs.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { LogsProvider } from '@services/logs/logs.service';
import { saveLog } from '@store/logs/logs.actions';
import { initialState } from '@store/logs/logs.reducer';
import { selectMergedRouteUrl } from '@store/router/router.selectors';
import * as UserActions from '@store/user/user-service.reducer';
import { of } from 'rxjs';

jest.mock('@/package.json', () => ({
	version: '1.0',
}));

const mockLog = () =>
	({
		type: LogType.INFO,
		message: 'this should log',
		timestamp: 99338,
	}) as Log;

describe('LogsProvider', () => {
	let logsProvider: LogsProvider;
	let httpService: HttpService;
	let store: MockStore;
	const additionalInfo = { appVersion: '1.0', employeeId: 'some-id', source: 'VTM' };
	const mockHttpService: jest.Mocked<Partial<HttpService>> = {
		sendLogs: jest.fn().mockReturnValue(of({})),
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				LogsProvider,
				{ provide: HttpService, useValue: mockHttpService },
				provideMockStore({ initialState }),
			],
		});

		logsProvider = TestBed.inject(LogsProvider);
		store = TestBed.inject(MockStore);
		httpService = TestBed.inject(HttpService);

		store.overrideSelector(UserActions.id, 'some-id');
	});

	describe('sendLogs', () => {
		it('should not attempt to send logs when list is empty', async () => {
			// ARRANGE
			const logs: Log[] = [];

			// ACT
			await logsProvider.sendLogs(logs);

			// ASSERT
			expect(httpService.sendLogs).not.toHaveBeenCalled();
		});

		it('should send authenticated logs when not empty', async () => {
			// ARRANGE
			const logs: Log[] = [{ ...mockLog() }, mockLog()];

			// ACT
			await logsProvider.sendLogs(logs);

			// ASSERT
			const expectedCallArgs = [
				{ ...mockLog(), ...additionalInfo },
				{ ...mockLog(), ...additionalInfo },
			];
			expect(httpService.sendLogs).toHaveBeenCalledWith(expectedCallArgs);
			expect(expectedCallArgs.every((log) => log.source === 'VTM')).toEqual(true);
		});
	});

	describe('dispatchLog', () => {
		it('should dispatch saveLog action with correct payload containing url and pageName', () => {
			// ARRANGE
			jest.spyOn(store, 'dispatch');

			const mockUrl = '/test-url';

			store.overrideSelector(selectMergedRouteUrl, mockUrl);

			Object.defineProperty(document, 'title', {
				value: 'Vehicle Testing Management - Test Page',
				writable: true,
			});

			// ACT
			logsProvider.dispatchLog(mockLog());

			// ASSERT
			expect(store.dispatch).toHaveBeenCalledWith(
				saveLog({
					...mockLog(),
					url: mockUrl,
					pageName: 'Test Page',
				})
			);
		});
	});
});
