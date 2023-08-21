import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TechnicalRecordHttpService } from './technical-record-http.service';
//TODO: need to include tests for search$, seachBy, getBySystemNumber, getRecordV3, AmendVrm, promoteTechRecord, generatePlate, generateLetter

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordHttpService;
  let httpClient: HttpTestingController;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [TechnicalRecordHttpService, provideMockStore({ initialState: initialAppState })]
    });
    httpClient = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TechnicalRecordHttpService);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpClient.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('API', () => {
    describe('createVehicleRecord', () => {
      it('should call post with the correct URL, body and response type', fakeAsync(() => {
        const expectedVehicle = {
          systemNumber: 'foo',
          createdTimestamp: 'bar',
          vin: 'testvin',
          primaryVrm: 'vrm1',
          techRecord_reasonForCreation: 'test'
        } as unknown as TechRecordType<'put'>;

        service.createVehicleRecord(expectedVehicle).subscribe();

        const request = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records`);

        expect(request.request.method).toEqual('POST');
        expect(request.request.body).toEqual(expectedVehicle);

        request.flush(expectedVehicle);
      }));

      it('should return an array with the newly created vehicle record', () => {
        const expectedVehicle = {
          systemNumber: 'foo',
          createdTimestamp: 'bar',
          vin: 'testvin',
          primaryVrm: 'vrm1',
          techRecord_reasonForCreation: 'test'
        } as unknown as TechRecordType<'put'>;

        expect(lastValueFrom(service.createVehicleRecord(expectedVehicle))).resolves.toEqual(expectedVehicle);

        const request = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records`);
        request.flush(expectedVehicle);
      });
    });

    describe('updateTechRecords', () => {
      it('should return a new tech record and updated status code', fakeAsync(() => {
        const expectedVehicle = {
          systemNumber: 'foo',
          createdTimestamp: 'bar',
          vin: 'testvin',
          primaryVrm: 'vrm1',
          techRecord_reasonForCreation: 'test',
          secondaryVrms: undefined
        } as TechRecordType<'get'>;
        service.updateTechRecords(expectedVehicle as TechRecordType<'put'>).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/v3/technical-records/${expectedVehicle.systemNumber}/${expectedVehicle.createdTimestamp}`
        );
        expect(req.request.method).toEqual('PATCH');

        // should format the vrms for the update payload
        expect(req.request.body).toHaveProperty('primaryVrm');
        expect(req.request.body).toHaveProperty('secondaryVrms');
        expect(req.request.body).not.toHaveProperty('vrms');
      }));
    });

    describe('archiveTechRecord', () => {
      it('should return a new tech record with status archived', fakeAsync(() => {
        service.archiveTechnicalRecord('foo', 'bar', 'foobar').subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/archive/foo/bar`);
        expect(req.request.method).toEqual('PATCH');
      }));
    });
  });
});
