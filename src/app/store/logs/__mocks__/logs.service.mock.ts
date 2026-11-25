export class LogsProviderMock {
	sendLogs = vi.fn().mockName('sendLogs');
	dispatchLog = vi.fn().mockName('dispatchLog');
}
