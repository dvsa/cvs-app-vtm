import type { Mocked } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Log, LogType } from '@models/logs/logs.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LogsProvider } from '@services/logs/logs.service';
import * as logsActions from '@store/logs/logs.actions';
import { LogsEffects } from '@store/logs/logs.effects';
import { getLogsState } from '@store/logs/logs.reducer';
import { Observable, of } from 'rxjs';

describe('LogsEffects', () => {
	let effects: LogsEffects;
	let actions$: Observable<Action>;
	let store: MockStore;
	const logsProviderMock = {
		sendLogs: vi.fn(),
	} as unknown as Mocked<LogsProvider>;

	beforeEach(() => {
		vi.useFakeTimers();

		TestBed.configureTestingModule({
			providers: [
				LogsEffects,
				provideMockActions(() => actions$),
				provideMockStore(),
				{ provide: LogsProvider, useValue: logsProviderMock },
			],
		});

		effects = TestBed.inject(LogsEffects);
		store = TestBed.inject(MockStore);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('startSendingLogsEffect$', () => {
		it('should emit sendLogs action every minute when startSendingLogs is dispatched', () => new Promise<void>((done) => {
			actions$ = of(logsActions.startSendingLogs());

			const emittedActions: Action[] = [];

			effects.startSendingLogsEffect$.subscribe((action) => {
				emittedActions.push(action);
				if (emittedActions.length === 3) {
					expect(emittedActions).toEqual([logsActions.sendLogs(), logsActions.sendLogs(), logsActions.sendLogs()]);
					done();
				}
			});

			// Fast-forward time by 3 minutes
			vi.advanceTimersByTime(3 * 60 * 1000);
		}));
	});

	describe('sendLogsEffect$', () => {
		it('should call logsProvider.sendLogs and dispatch sendLogsSuccess when successful', () => new Promise<void>((done) => {
			const mockLogs: Log[] = [{ type: LogType.DEBUG, message: 'Test log', timestamp: Date.now() }];

			store.overrideSelector(getLogsState, mockLogs);
			logsProviderMock.sendLogs.mockReturnValue(Promise.resolve(true));

			actions$ = of(logsActions.sendLogs());

			effects.sendLogsEffect$.subscribe((resultAction) => {
				expect(resultAction).toEqual(logsActions.sendLogsSuccess());
				expect(logsProviderMock.sendLogs).toHaveBeenCalledWith(mockLogs);
				done();
			});
		}));

		it('should dispatch sendLogsFailure when logsProvider.sendLogs fails', () => new Promise<void>((done) => {
			const mockError = new Error('Test error');
			const mockLogs: Log[] = [{ type: LogType.DEBUG, message: 'Test log', timestamp: Date.now() }];

			store.overrideSelector(getLogsState, mockLogs);
			logsProviderMock.sendLogs.mockRejectedValue(mockError);

			actions$ = of(logsActions.sendLogs());

			effects.sendLogsEffect$.subscribe((resultAction) => {
				expect(resultAction).toEqual(logsActions.sendLogsFailure(mockError));
				expect(logsProviderMock.sendLogs).toHaveBeenCalledWith(mockLogs);
				done();
			});
		}));

		it('should not send logs when isAutomation is true', () => {
			// Set the "isAutomation" class prop to true for this test
			Object.defineProperty(effects, 'isAutomation', { value: true });

			const sendLogsSpy = vi.spyOn(logsProviderMock, 'sendLogs');

			actions$ = of(logsActions.sendLogs());

			effects.sendLogsEffect$.subscribe({
				next: () => {
					throw new Error('Effect should not emit any action due to filter');
				},
				complete: () => {
					expect(sendLogsSpy).not.toHaveBeenCalled();
				},
			});
		});
	});
});
