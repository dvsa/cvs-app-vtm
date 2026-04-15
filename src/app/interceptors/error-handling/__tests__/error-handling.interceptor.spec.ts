import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ErrorInterceptor } from '../error-handling.interceptor';

@Component({
	selector: 'app-dummy-component',
	template: '',
})
class DummyComponent {}

describe('ErrorInterceptor', () => {
	let router: Router;
	let http: HttpClient;
	let httpController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [DummyComponent, HttpClientTestingModule],
			providers: [
				provideRouter([
					{
						path: '',
						component: DummyComponent,
					},
					{
						path: 'error',
						component: DummyComponent,
					},
				]),
				ErrorInterceptor,
				{
					provide: HTTP_INTERCEPTORS,
					useClass: ErrorInterceptor,
					multi: true,
				},
			],
		});
	});

	beforeEach(() => {
		router = TestBed.inject(Router);
		http = TestBed.inject(HttpClient);
		httpController = TestBed.inject(HttpTestingController);
		vi.clearAllMocks();
	});

	it('should be created', () => {
		const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);

		expect(interceptor).toBeTruthy();
	});

	it('should navigate to error page on a 500', fakeAsync(() => {
		const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

		http.get('http://www.google.com').subscribe({
			next: () => {},
			error: (e) => {
				expect(e.status).toBe(500);
			},
		});

		const req = httpController.expectOne('http://www.google.com');
		req.flush('string', { status: 500, statusText: 'Internal Server Error' });

		tick();

		expect(navigateSpy).toHaveBeenCalledWith('error');
	}));

	it('should not navigate to error page on a success', fakeAsync(() => {
		const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

		http.get('http://www.google.com').subscribe({
			next: (response) => {
				expect(response).toBe('string');
			},
			error: () => {},
		});

		const req = httpController.expectOne('http://www.google.com');
		req.flush('string');
		tick();
		expect(navigateSpy).not.toHaveBeenCalled();
	}));
});
