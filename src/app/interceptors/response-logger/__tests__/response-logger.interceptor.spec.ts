import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResponseLoggerInterceptor } from '@interceptors/response-logger/response-logger.interceptor';
import { LogType } from '@models/logs/logs.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CompressionService } from '@services/compression/compression.service';
import { LogsProvider } from '@services/logs/logs.service';
import { id, initialState } from '@store/user/user-service.reducer';
import { of, throwError } from 'rxjs';

describe('Interceptor: ResponseLoggerInterceptor', () => {
	let interceptor: ResponseLoggerInterceptor;
	let logsProvider: jest.Mocked<LogsProvider>;
	let compressionService: jest.Mocked<CompressionService>;
	let mockStore: MockStore;
	const mockThreshold = 10000;
	const mockReq = new HttpRequest('GET', 'https://example.com');
	const mockNext = {
		handle: jest.fn(),
	} as jest.Mocked<HttpHandler>;

	beforeEach(() => {
		const logsProviderMock = {
			dispatchLog: jest.fn(),
		};

		const compressionServiceMock = {
			extract: jest.fn(),
		};

		TestBed.configureTestingModule({
			providers: [
				ResponseLoggerInterceptor,
				{ provide: LogsProvider, useValue: logsProviderMock },
				{ provide: CompressionService, useValue: compressionServiceMock },
				provideMockStore({ initialState }),
			],
		});

		interceptor = TestBed.inject(ResponseLoggerInterceptor);
		logsProvider = TestBed.inject(LogsProvider) as jest.Mocked<LogsProvider>;
		mockStore = TestBed.inject(MockStore);
		compressionService = TestBed.inject(CompressionService) as jest.Mocked<CompressionService>;

		jest.spyOn(interceptor, 'threshold', 'get').mockReturnValue(mockThreshold);

		mockStore.overrideSelector(id, 'test-oid');
	});

	it('should be created', () => {
		expect(interceptor).toBeTruthy();
	});

	it('should calculate request duration', () => {
		expect(interceptor.getRequestDuration(11000, 10000)).toEqual(1000);
	});

	it('should not log when request is for local assets', (done) => {
		const localReq = new HttpRequest('GET', 'assets/test.json');
		mockNext.handle.mockReturnValue(of(new HttpResponse()));

		interceptor.intercept(localReq, mockNext).subscribe(() => {
			expect(logsProvider.dispatchLog).not.toHaveBeenCalled();
			done();
		});
	});

	it('should log successful responses', (done) => {
		const mockResponse = new HttpResponse({ status: 200, statusText: 'OK', url: 'https://example.com' });
		mockNext.handle.mockReturnValue(of(mockResponse));

		interceptor.intercept(mockReq, mockNext).subscribe(() => {
			expect(logsProvider.dispatchLog).toHaveBeenCalledWith({
				type: LogType.INFO,
				message: 'test-oid - 200 OK for API call to https://example.com',
				timestamp: expect.any(Number),
			});
			done();
		});
	});

	it('should decompress payload when header detected and body is a string', () => {
		jest.spyOn(compressionService, 'extract');

		const mockResponse = new HttpResponse({
			status: 200,
			statusText: 'OK',
			url: 'https://example.com',
			headers: new HttpHeaders().set('Content-Encoding', 'base64+gzip'),
			body: 'H4sIAAAAAAAAA6tWykjNyclXslIqyUgtSlWqBQD9aiCXEQAAAA==',
		});

		jest.spyOn(mockNext, 'handle').mockReturnValue(of(mockResponse));

		interceptor.intercept(mockReq, mockNext).subscribe(() => {
			expect(logsProvider.dispatchLog).toHaveBeenCalledWith({
				type: LogType.INFO,
				message: '200 OK for API call to https://example.com',
				timestamp: jasmine.any(Number),
			});
			expect(compressionService.extract).toHaveBeenCalled();
		});
	});

	it('should attempt to decompress payload, but fail and return data as API sent it', () => {
		jest.spyOn(compressionService, 'extract').mockImplementation(() => {
			throw new Error('Decompression failed');
		});

		const headers = new HttpHeaders().set('Content-Encoding', 'base64+gzip');

		const mockResponse = new HttpResponse({
			status: 200,
			statusText: 'OK',
			url: 'https://example.com',
			headers,
			body: 'bad string',
		});

		jest.spyOn(mockNext, 'handle').mockReturnValue(of(mockResponse));

		interceptor.intercept(mockReq, mockNext).subscribe(() => {
			expect(logsProvider.dispatchLog).toHaveBeenCalledWith({
				type: LogType.INFO,
				message: '200 OK for API call to https://example.com',
				timestamp: jasmine.any(Number),
			});
			expect(compressionService.extract).toHaveBeenCalled();
			expect(logsProvider.dispatchLog).toHaveBeenCalledWith({
				type: LogType.ERROR,
				message: 'Could not decompress payload',
				body: 'bad string',
				headers,
				err: new Error('Decompression failed'),
			});
		});
	});

	it('should log when request is slower than threshold', (done) => {
		const mockResponse = new HttpResponse({ status: 200, statusText: 'OK', url: 'https://example.com' });
		mockNext.handle.mockReturnValue(of(mockResponse));

		jest.spyOn(interceptor, 'getRequestDuration').mockReturnValue(mockThreshold + 1);

		interceptor.intercept(mockReq, mockNext).subscribe(() => {
			expect(logsProvider.dispatchLog).toHaveBeenCalledWith({
				timestamp: expect.any(Number),
				oid: 'test-oid',
				type: LogType.WARN,
				detail: 'Long Request',
				message: 'Request to https://example.com is taking longer than 10 seconds',
				requestDurationInMs: mockThreshold + 1,
			});
			done();
		});
	});

	it('should log errors', (done) => {
		const mockError = new HttpErrorResponse({
			status: 404,
			statusText: 'Not Found',
			url: 'https://example.com',
			error: 'This is a big error',
		});

		mockNext.handle.mockReturnValue(throwError(() => mockError));

		interceptor.intercept(mockReq, mockNext).subscribe({
			error: () => {
				expect(logsProvider.dispatchLog).toHaveBeenCalledWith({
					type: LogType.ERROR,
					message: 'test-oid - Method: GET. Http failure response for https://example.com: 404 Not Found.',
					status: 404,
					errors: 'This is a big error',
					stackTrace: undefined,
					timestamp: expect.any(Number),
				});
				done();
			},
		});
	});
});
