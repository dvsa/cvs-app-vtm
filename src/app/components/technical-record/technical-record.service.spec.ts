import {TestBed, inject, getTestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TechnicalRecordService} from './technical-record.service';
import {MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {environment} from '../../../environments/environment';

export const adalConfig = {
  cacheLocation: 'localStorage',
  clientId: 'appId',
  endpoints: {
    api: 'endpoint'
  },
  postLogoutRedirectUri: window.location.origin,
  tenant: '<tenant name>.onmicrosoft.com'
};

const routes = {
  techRecords: (searchIdentifier: string) => `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records`,
  techRecordsAllStatuses: (searchIdentifier: string) =>
    `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`
};

describe('TechnicalRecordService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TechnicalRecordService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            'https://localhost/Api/': 'xxx-xxx1-1111-x111-xxx'
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage',
        })
      ],
      providers: [TechnicalRecordService]
    });
    injector = getTestBed();
    service = injector.get(TechnicalRecordService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', inject([HttpTestingController, MsAdalAngular6Service], (serviceI: TechnicalRecordService) => {
    expect(serviceI).toBeTruthy();
  }));

  it('getTechnicalRecords should return data', (done) => {
    service.getTechnicalRecords('1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual({mockObject: 'mock'});
      done();
    });

    const req = httpMock.expectOne(routes.techRecords('1234567'));
    expect(req.request.method).toBe('GET');
    req.flush({mockObject: 'mock'});
  });

  it('getTechnicalRecordsAllStatuses should return data', (done) => {
    service.getTechnicalRecordsAllStatuses('1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual({mockObject: 'mock'});
      done();
    });

    const req = httpMock.expectOne(routes.techRecordsAllStatuses('1234567'));
    expect(req.request.method).toBe('GET');
    req.flush({mockObject: 'mock'});
  });

  it('handleError should return empty result', (done) => {
    service.getTechnicalRecordsAllStatuses('T14392PSAF').subscribe((res) => {
      expect(res).toEqual([]);
      done();
    });

    const req = httpMock.expectOne(routes.techRecordsAllStatuses('T14392PSAF'));
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('network error'));
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
