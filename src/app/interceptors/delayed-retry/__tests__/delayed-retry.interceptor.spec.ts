import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { DelayedRetryInterceptor, HTTP_RETRY_CONFIG } from '../delayed-retry.interceptor';

describe('DelayedRetryInterceptor', () => {
	let httpTestingController: HttpTestingController;
	let client: HttpClient;
	let interceptor: DelayedRetryInterceptor;

	const DUMMY_ENDPOINT = 'https://www.someapi.com';

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				DelayedRetryInterceptor,
				{
					provide: HTTP_INTERCEPTORS,
					useClass: DelayedRetryInterceptor,
					multi: true,
				},
				provideMockStore({ initialState: initialAppState }),
			],
		});
	});

	describe('default config', () => {
		it('should be created', () => {
			interceptor = TestBed.inject(DelayedRetryInterceptor);
			expect(interceptor).toBeTruthy();
			expect(interceptor.config).toEqual({
				count: 3,
				delay: 2000,
				backoff: false,
				whiteList: [],
			});
		});
	});

	describe('no backof', () => {
		beforeEach(() => {
			TestBed.overrideProvider(HTTP_RETRY_CONFIG, { useValue: { delay: 500, count: 3, httpStatusRetry: [504] } });
			client = TestBed.inject(HttpClient);
			httpTestingController = TestBed.inject(HttpTestingController);
			interceptor = TestBed.inject(DelayedRetryInterceptor);
		});

		afterEach(() => {
			// After every test, assert that there are no more pending requests.
			httpTestingController.verify();
		});

		it('should throw error "Request timed out. Check connectivity and try again." after final retry', fakeAsync(() => {
			client.get(DUMMY_ENDPOINT).subscribe({
				error: (e) => {
					expect(e).toEqual(new Error('Request timed out. Check connectivity and try again.'));
				},
			});
			const retryCount = 3;
			for (let i = 0, c = retryCount; i < c; i++) {
				tick(500);
				const req = httpTestingController.expectOne(DUMMY_ENDPOINT);
				req.flush('Deliberate 504 error', { status: 504, statusText: 'Gateway Timeout' });
			}
			flush();
		}));

		it('should cascade errors not in the retry list', (done) => {
			client.get(DUMMY_ENDPOINT).subscribe({
				error: (e) => {
					const { error, status, statusText } = e;
					expect(error).toBe('Deliberate 401 error');
					expect(status).toBe(401);
					expect(statusText).toBe('401 Unauthorized');
					done();
				},
			});
			const req = httpTestingController.expectOne(DUMMY_ENDPOINT);
			req.flush('Deliberate 401 error', { status: 401, statusText: '401 Unauthorized' });
		});
	});

	describe('backoff', () => {
		beforeEach(() => {
			TestBed.overrideProvider(HTTP_RETRY_CONFIG, { useValue: { count: 3, delay: 500, backoff: true } });
			client = TestBed.inject(HttpClient);
			httpTestingController = TestBed.inject(HttpTestingController);
		});

		afterEach(() => {
			// After every test, assert that there are no more pending requests.
			httpTestingController.verify();
		});

		it('should stagger retry requests', fakeAsync(() => {
			client.get(DUMMY_ENDPOINT).subscribe({
				error: (e) => {
					expect(e).toEqual(new Error('Request timed out. Check connectivity and try again.'));
				},
			});

			const retryCount = 3;
			for (let i = 0; i < retryCount; i++) {
				tick(500 * (i + 1));
				const req = httpTestingController.expectOne(DUMMY_ENDPOINT);
				req.flush('Deliberate 504 error', { status: 504, statusText: 'Gateway Timeout' });
			}
			flush();
		}));
	});

	describe('Http failure response for x: 0 Unknown Error', () => {
		beforeEach(() => {
			TestBed.overrideProvider(HTTP_RETRY_CONFIG, {
				useValue: { delay: 500, count: 3, httpStatusRetry: [0, 504], whiteList: [DUMMY_ENDPOINT] },
			});
			client = TestBed.inject(HttpClient);
			httpTestingController = TestBed.inject(HttpTestingController);
			interceptor = TestBed.inject(DelayedRetryInterceptor);
		});

		afterEach(() => {
			// After every test, assert that there are no more pending requests.
			httpTestingController.verify();
		});

		it('should handle response codes of 0 (Unknown Error) by retrying the request', fakeAsync(() => {
			client.get(DUMMY_ENDPOINT).subscribe({
				error: (e) => {
					expect(e).toEqual(new Error('Request timed out. Check connectivity and try again.'));
				},
			});

			const retryCount = 3;
			for (let i = 0; i < retryCount; i++) {
				tick(500 * (i + 1));
				const req = httpTestingController.expectOne(DUMMY_ENDPOINT);
				req.flush('Deliberate 0 error', { status: 0, statusText: 'Unknown error' });
			}
			flush();
		}));
	});
});
