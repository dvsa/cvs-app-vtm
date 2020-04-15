import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AppConfig } from '@app/app.config';
import { TechnicalRecordService } from './technical-record.service';
import { Store, INITIAL_STATE } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { hot } from 'jasmine-marbles';
import { DocumentInfo, DocumentMetaData } from '@app/models/document-meta-data';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';

const appConfigMock = {
  get settings() {
    return {
      apiServer: {
        APITechnicalRecordServerUri: `http://localhost:3005`,
        APIDocumentsServerUri: `http://localhost:3005`,
        APIDocumentBlobUri: `/devops-provided-link%2F`
      }
    };
  }
};

describe('TechnicalRecordService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TechnicalRecordService;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TechnicalRecordService,
        { provide: AppConfig, useValue: appConfigMock },
        {
          provide: Store,
          useValue: {
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

    const request = httpMock.expectOne((req) =>
      req.url.includes(
        `/vehicles/1234567/tech-records?status=all&metadata=true&searchCriteria=${'vin'}`
      )
    );
    request.flush(mock);
  });

  it('createTechnicalRecord should create vehicle technical record', (done) => {
    const mock = 'mock';
    const recordCreated = { techRecord: [], vin: 'ABCDEF123' } as VehicleTechRecordEdit;

    service.createTechnicalRecord(recordCreated).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });

    const request = httpMock.expectOne((req) => req.url.includes(`/vehicles`));
    request.flush(mock);
  });

  it('updateTechnicalRecords should update technical record', (done) => {
    const mock = { techRecord: [] } as VehicleTechRecordModel;
    const recordUpdate = { techRecord: [] } as VehicleTechRecordEdit;
    service.updateTechnicalRecords(recordUpdate, '1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });

    const request = httpMock.expectOne((req) => req.url.includes(`/vehicles/1234567`));
    request.flush(mock);
  });

  describe('uploadDocument', () => {
    it('should upload file document', () => {
      const params = {
        metaName: 'UUID_something.pdf',
        file: new File(['fdd@Fd'], 'something.pdf')
      } as DocumentInfo;

      const uri = `${appConfigMock.settings.apiServer.APIDocumentBlobUri}${params.metaName}`;

      // act
      service.uploadDocument(params);

      // assert
      const mock = { mockObject: 'mock' };
      const putRequest = httpMock.expectOne((req) => req.url.includes(uri));
      expect(putRequest.request.method).toBe('PUT');
      expect(putRequest.request.url).toEqual(uri);
      expect(putRequest.request.body).toEqual(params.file);
      expect(putRequest.request.headers.get('Content-Type')).toEqual('application/octet-stream');

      putRequest.flush(mock);
    });
  });

  describe('downloadDocument', () => {
    it('should download the document', () => {
      const params = {
        metaName: 'UUID_fileName',
        fileName: 'fileName'
      } as DocumentMetaData;

      const uri = `${appConfigMock.settings.apiServer.APIDocumentBlobUri}${params.metaName}`;

      // act
      service.downloadDocument(params);

      // assert
      const mock = { mockObject: 'mock' };
      const getRequest = httpMock.expectOne((req) => req.url.includes(uri));
      expect(getRequest.request.method).toBe('GET');
      expect(getRequest.request.url).toEqual(uri);
      expect(getRequest.request.headers.get('Accept')).toEqual('*/*');
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
