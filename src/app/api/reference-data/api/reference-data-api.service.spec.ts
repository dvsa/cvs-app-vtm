import { HttpEventType, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { toArray } from 'rxjs';
import { Configuration } from '../configuration';
import { ReferenceDataApiResponse } from '../model/reference-data.model';
import { BASE_PATH } from '../variables';
import { ReferenceDataApiService } from './reference-data-api.service';

describe('ReferenceDataApiService', () => {
  let service: ReferenceDataApiService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReferenceDataApiService]
    });
  });

  describe(ReferenceDataApiService.prototype.getAllFromResource.name, () => {
    beforeEach(() => {
      service = TestBed.inject(ReferenceDataApiService);
      controller = TestBed.inject(HttpTestingController);
      controller.verify();
    });

    it('should throw error "resourceType is required"', done => {
      service.getAllFromResource('').subscribe({
        error: e => {
          expect(e.message).toBe('resourceType is required');
          done();
        }
      });

      controller.expectNone('https://url/api/v1/reference/foo', 'get all ref data with resourceType ""');
    });

    it('should return an observable of response body', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service.getAllFromResource('foo').subscribe(res => {
        expect(res.data[0]).toBeTruthy();
        done();
      });

      const req = controller.expectOne('https://url/api/v1/reference/foo', 'get all ref data with resourceType foo and observe body');
      req.flush(mockData);
    });

    it('should return an observable instance of HttpResponse', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service.getAllFromResource('foo', 'response').subscribe(res => {
        expect(res.body?.data[0]).toBeTruthy();
        done();
      });

      const req = controller.expectOne('https://url/api/v1/reference/foo', 'get all ref data with resourceType foo and observe request');
      req.flush(mockData);
    });

    it('should emit HttpEvents', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service
        .getAllFromResource('foo', 'events')
        .pipe(toArray())
        .subscribe(res => {
          expect(res.length).toBe(2);
          expect(res[0].type).toBe(HttpEventType.Sent);
          expect(res[1].type).toBe(HttpEventType.Response);
          done();
        });

      const req = controller.expectOne('https://url/api/v1/reference/foo', 'get all ref data with resourceType foo and observe events');
      req.flush(mockData);
    });
  });

  describe('with BASE_PATH injection', () => {
    beforeEach(() => {
      TestBed.overrideProvider(BASE_PATH, { useValue: 'http://custom.path' });
      service = TestBed.inject(ReferenceDataApiService);
      controller = TestBed.inject(HttpTestingController);
    });

    it('should use base path value from injection token', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service.getAllFromResource('foo').subscribe(res => {
        done();
      });

      const req = controller.expectOne('http://custom.path/reference/foo');
      req.flush(mockData);
    });
  });

  describe('with Configuration injection', () => {
    beforeEach(() => {
      TestBed.overrideProvider(Configuration, { useFactory: () => new Configuration({ basePath: 'http://custom/config' }) });
      service = TestBed.inject(ReferenceDataApiService);
      controller = TestBed.inject(HttpTestingController);
    });

    it('should use base path value from injection token', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service.getAllFromResource('foo').subscribe(res => {
        done();
      });

      const req = controller.expectOne('http://custom/config/reference/foo');
      req.flush(mockData);
    });
  });

  describe(ReferenceDataApiService.prototype.getOneFromResource.name, () => {
    beforeEach(() => {
      service = TestBed.inject(ReferenceDataApiService);
      controller = TestBed.inject(HttpTestingController);
      controller.verify();
    });

    it('should throw error "resourceType is required"', done => {
      service.getOneFromResource('').subscribe({
        error: e => {
          expect(e.message).toBe('resourceType is required');
          done();
        }
      });

      controller.expectNone('https://url/api/v1/reference/foo/bar', 'get all ref data with resourceType ""');
    });

    it('should throw error "resourceKey is required"', done => {
      service.getOneFromResource('foo', '').subscribe({
        error: e => {
          expect(e.message).toBe('resourceKey is required');
          done();
        }
      });

      controller.expectNone('https://url/api/v1/reference/foo/bar', 'get all ref data with resourceType ""');
    });

    it('should return an observable of response body', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service.getOneFromResource('foo', 'bar').subscribe(res => {
        expect(res).toBeTruthy();
        done();
      });

      const req = controller.expectOne('https://url/api/v1/reference/foo/bar', 'get all ref data with resourceType foo and observe body');
      req.flush(mockData);
    });

    it('should return an observable instance of HttpResponse', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service.getOneFromResource('foo', 'bar', 'response').subscribe(res => {
        expect(res instanceof HttpResponse).toBeTruthy();
        expect(res.body).toBeTruthy();
        done();
      });

      const req = controller.expectOne('https://url/api/v1/reference/foo/bar', 'get all ref data with resourceType foo and observe request');
      req.flush(mockData);
    });

    it('should emit HttpEvents', done => {
      const mockData = <ReferenceDataApiResponse>{ data: [{ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'bar' }] };

      service
        .getOneFromResource('foo', 'bar', 'events')
        .pipe(toArray())
        .subscribe(res => {
          expect(res.length).toBe(2);
          expect(res[0].type).toBe(HttpEventType.Sent);
          expect(res[1].type).toBe(HttpEventType.Response);
          done();
        });

      const req = controller.expectOne('https://url/api/v1/reference/foo/bar', 'get all ref data with resourceType foo and observe events');
      req.flush(mockData);
    });
  });
});
