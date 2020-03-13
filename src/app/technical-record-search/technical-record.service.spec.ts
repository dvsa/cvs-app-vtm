import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AppConfig } from '@app/app.config';
import { environment } from '@environments/environment';
import { TechnicalRecordService } from './technical-record.service';
import { HttpParams } from '@angular/common/http';
import { Store, INITIAL_STATE } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { hot } from 'jasmine-marbles';

const appConfigMock = {
  get settings() {
    return {
      apiServer: {
        APITechnicalRecordServerUri: `http://localhost:3005`,
        APIDocumentsServerUri: `http://localhost:3005`
      }
    };
  }
};

describe('TechnicalRecordService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TechnicalRecordService;
  let store: Store<IAppState>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        TechnicalRecordService,
        { provide: AppConfig, useValue: appConfigMock },
        {
          provide: Store, useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        }
      ]
    }).compileComponents();
    injector = getTestBed();
    store = injector.get(Store);
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
    const mock = { mockObject: 'mock' };
    service.getTechnicalRecordsAllStatuses('1234567', 'vin').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne(req => req.url.includes(`/vehicles/1234567/tech-records?status=all&metadata=true`));
    req.flush(mock);
  });

  it('updateTechnicalRecords should update entry', (done) => {
    const mock = { mockObject: 'mock' };
    service.updateTechnicalRecords('techRec','1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne(req => req.url.includes(`/vehicles/1234567`));
    req.flush(mock);
  });

  describe('uploadDocuments', () => {
    it('should return observable of success mesage when the argument can be transformed into json', (done) => {
      const submitData = { test: 'test' };
      spyOn(console, 'log');
      const expectedMessage = 'succeeded';
      service.uploadDocuments(submitData).subscribe(res => {
        expect(res).toBe(expectedMessage);
        expect(console.log).toHaveBeenCalledWith(`inside uploadDocuments received submiData => ${JSON.stringify(submitData)}`);
        done();
      });
    });
  });

  describe('getDocumentBlob', () => {
    it('should transform the document into a blob file when passed a vin number', (done) => {
      const vin = '123456';
      const fileName = 'test';
      service.getDocumentBlob(vin, fileName).subscribe(res => {
        expect(res).toMatchObject({ buffer: new ArrayBuffer(3), contentType: 'json', fileName: 'test' });
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes('http://localhost:3005/vehicles/123456/download-file'));
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('json');
      req.flush({ fileBuffer: { data: ['1', '2', '3'] }, contentType: 'json' });
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
