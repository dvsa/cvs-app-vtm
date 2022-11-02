import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorInterceptor } from './error-handling.interceptor';

@Component({
  selector: 'dummyComponent',
  template: ''
})
class DummyComponent {}

describe('ErrorInterceptor', () => {
  let router: Router;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: DummyComponent
          },
          {
            path: 'error',
            component: DummyComponent
          }
        ])
      ],
      providers: [
        ErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);

    expect(interceptor).toBeTruthy();
  });

  it('should navigate to error page on a 500', fakeAsync(() => {
    http.get('http://www.google.com').subscribe({
      next: response => {},
      error: e => {
        expect(e.message).toBe('Internal Server Error');
      }
    });

    const req = httpController.expectOne('http://www.google.com');
    req.flush('string', { status: 500, statusText: 'Internal Server Error' });

    tick();

    expect(router.url).toBe('/error');
  }));

  it('should not navigate to error page on a success', fakeAsync(() => {
    http.get('http://www.google.com').subscribe({
      next: response => {
        expect(response).toBe('string');
      },
      error: e => {}
    });

    const req = httpController.expectOne('http://www.google.com');
    req.flush('string');
    tick();
    expect(router.url).toBe('/');
  }));
});
