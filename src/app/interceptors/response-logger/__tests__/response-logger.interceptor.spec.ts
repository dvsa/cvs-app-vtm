import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResponseLoggerInterceptor } from '@interceptors/response-logger/response-logger.interceptor';
import { LogType } from '@models/logs/logs.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { selectMergedRouteUrl } from '@store/router/router.selectors';
import { id, initialState } from '@store/user/user-service.reducer';
import { of, throwError } from 'rxjs';

describe('Interceptor: ResponseLoggerInterceptor', () => {
	let interceptor: ResponseLoggerInterceptor;
	let httpService: jest.Mocked<HttpService>;
	let mockStore: MockStore;
	const mockThreshold = 10000;
	const mockReq = new HttpRequest('GET', 'https://example.com');
	const mockNext = {
		handle: jest.fn(),
	} as jest.Mocked<HttpHandler>;

	beforeEach(() => {
		const httpServiceMock = {
			sendLogs: jest.fn(),
		};

		TestBed.configureTestingModule({
			providers: [
				ResponseLoggerInterceptor,
				{ provide: HttpService, useValue: httpServiceMock },
				provideMockStore({ initialState }),
			],
		});

		interceptor = TestBed.inject(ResponseLoggerInterceptor);
		httpService = TestBed.inject(HttpService) as jest.Mocked<HttpService>;
		mockStore = TestBed.inject(MockStore);

		jest.spyOn(interceptor, 'threshold', 'get').mockReturnValue(mockThreshold);

		mockStore.overrideSelector(id, 'test-oid');
		mockStore.overrideSelector(selectMergedRouteUrl, 'some-url');
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
			expect(httpService.sendLogs).not.toHaveBeenCalled();
			done();
		});
	});

	it('should log successful responses', (done) => {
		const mockResponse = new HttpResponse({ status: 200, statusText: 'OK', url: 'https://example.com' });
		mockNext.handle.mockReturnValue(of(mockResponse));

		interceptor.intercept(mockReq, mockNext).subscribe(() => {
			expect(httpService.sendLogs).toHaveBeenCalledWith([
				{
					type: LogType.INFO,
					message: 'test-oid - 200 OK for API call to https://example.com',
					timestamp: expect.any(Number),
					appVersion: expect.any(String),
					pageName: expect.any(String),
					employeeId: 'test-oid',
					source: 'VTM',
					url: 'some-url',
				},
			]);
			done();
		});
	});

	it('should log when request is slower than threshold', (done) => {
		const mockResponse = new HttpResponse({ status: 200, statusText: 'OK', url: 'https://example.com' });
		mockNext.handle.mockReturnValue(of(mockResponse));

		jest.spyOn(interceptor, 'getRequestDuration').mockReturnValue(mockThreshold + 1);

		interceptor.intercept(mockReq, mockNext).subscribe(() => {
			expect(httpService.sendLogs).toHaveBeenCalledWith([
				{
					timestamp: expect.any(Number),
					oid: 'test-oid',
					type: LogType.WARN,
					detail: 'Long Request',
					message: 'Request to https://example.com is taking longer than 10 seconds',
					requestDurationInMs: mockThreshold + 1,
					appVersion: expect.any(String),
					pageName: expect.any(String),
					employeeId: 'test-oid',
					source: 'VTM',
					url: 'some-url',
				},
			]);
			done();
		});
	});

	it('should log errors', (done) => {
		const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: 'https://example.com' });
		mockNext.handle.mockReturnValue(throwError(() => mockError));

		interceptor.intercept(mockReq, mockNext).subscribe({
			error: () => {
				expect(httpService.sendLogs).toHaveBeenCalledWith([
					{
						type: LogType.ERROR,
						message: 'test-oid - Http failure response for https://example.com: 404 Not Found',
						status: 404,
						errors: undefined,
						timestamp: expect.any(Number),
						appVersion: expect.any(String),
						pageName: expect.any(String),
						employeeId: 'test-oid',
						source: 'VTM',
						url: 'some-url',
					},
				]);
				done();
			},
		});
	});
});
