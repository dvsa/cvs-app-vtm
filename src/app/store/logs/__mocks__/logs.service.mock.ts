export class LogsProviderMock {
	sendLogs = jasmine.createSpy('sendLogs');
	dispatchLog = jasmine.createSpy('dispatchLog');
}
