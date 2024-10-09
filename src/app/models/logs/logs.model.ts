export type LogsModel = Log[];

export type Log = {
	type: string;
	message: string;
	timestamp: number;
	[propName: string]: unknown;
};

export enum LogType {
	DEBUG = 'debug',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
}
