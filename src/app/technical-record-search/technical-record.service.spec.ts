import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AppConfig } from '@app/app.config';
import { environment } from '@environments/environment';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { TechnicalRecordService } from './technical-record.service';

const routes = {
  techRecords: (searchIdentifier: string) => `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records`,
  techRecordsAllStatuses: (searchIdentifier: string) =>
    `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`
};

const appConfigMock = {
  get settings() {
    return {
      apiServer: {
        APITechnicalRecordServerUri: 'http://localhost:3005'
      }
    };
  }
};

describe('TechnicalRecordService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TechnicalRecordService;
  let actions: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        TechnicalRecordService,
        { provide: AppConfig, useValue: appConfigMock },
        provideMockActions(() => actions)
      ]
    }).compileComponents();
    injector = getTestBed();
    service = injector.get(TechnicalRecordService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTechnicalRecordsAllStatuses should return data', (done) => {
    service.getTechnicalRecordsAllStatuses('1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual({ mockObject: 'mock' });
      done();
    });

    const req = httpMock.expectOne(routes.techRecordsAllStatuses('1234567'));
    expect(req.request.method).toBe('GET');
    req.flush({ mockObject: 'mock' });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
