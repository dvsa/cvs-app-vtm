/* eslint-disable @typescript-eslint/unbound-method */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { fetchSearchResult } from '@store/tech-record-search/actions/tech-record-search.actions';
import { lastValueFrom, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TechnicalRecordHttpService } from './technical-record-http.service';

// TODO: need to include tests for search$, seachBy, getBySystemNumber, getRecordV3, AmendVrm, promoteTechRecord, generatePlate, generateLetter

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordHttpService;
  let httpClient: HttpTestingController;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [TechnicalRecordHttpService, provideMockStore({ initialState: initialAppState })],
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
          techRecord_reasonForCreation: 'test',
        } as unknown as TechRecordType<'put'>;

        service.createVehicleRecord$(expectedVehicle).subscribe();

        const request = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records`);

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(expectedVehicle);

        request.flush(expectedVehicle);
      }));

      it('should return an array with the newly created vehicle record', () => {
        const expectedVehicle = {
          systemNumber: 'foo',
          createdTimestamp: 'bar',
          vin: 'testvin',
          primaryVrm: 'vrm1',
          techRecord_reasonForCreation: 'test',
        } as unknown as TechRecordType<'put'>;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises, jest/valid-expect
        expect(lastValueFrom(service.createVehicleRecord$(expectedVehicle))).resolves.toEqual(expectedVehicle);

        const request = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records`);
        request.flush(expectedVehicle);
      });
    });

    describe('updateTechRecords', () => {
      it('should return a new tech record and updated status code', fakeAsync(() => {
        const systemNumber = '123456';
        const createdTimestamp = '2022';
        const expectedVehicle = {
          systemNumber: 'foo',
          createdTimestamp: 'bar',
          vin: 'testvin',
          primaryVrm: 'vrm1',
          techRecord_reasonForCreation: 'test',
          secondaryVrms: undefined,
        } as TechRecordType<'get'>;
        service.updateTechRecords$(systemNumber, createdTimestamp, expectedVehicle as TechRecordType<'put'>).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`);
        expect(req.request.method).toBe('PATCH');

        // should format the vrms for the update payload
        expect(req.request.body).toHaveProperty('primaryVrm');
        expect(req.request.body).toHaveProperty('secondaryVrms');
      }));
    });

    describe('archiveTechRecord', () => {
      it('should return a new tech record with status archived', fakeAsync(() => {
        service.archiveTechnicalRecord$('foo', 'bar', 'foobar').subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/archive/foo/bar`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toHaveProperty('reasonForArchiving');
      }));
    });

    describe('generateLetter', () => {
      it('should call v3/technical-records/letter', fakeAsync(() => {
        const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
        service.generateLetter$(technicalRecord, 'test', 123, {}).subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/letter/HGV/${technicalRecord.createdTimestamp}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toHaveProperty('vtmUsername');
        expect(req.request.body).toHaveProperty('letterType');
        expect(req.request.body).toHaveProperty('paragraphId');
        expect(req.request.body).toHaveProperty('recipientEmailAddress');
      }));
    });

    describe('generatePlate', () => {
      it('should call v3/technical-records/plate', fakeAsync(() => {
        const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
        service.generatePlate$(technicalRecord, 'reason', {}).subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/plate/HGV/${technicalRecord.createdTimestamp}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toHaveProperty('vtmUsername');
        expect(req.request.body).toHaveProperty('reasonForCreation');
        expect(req.request.body).toHaveProperty('recipientEmailAddress');
      }));
    });

    describe('promoteTechnicalRecord', () => {
      it('should call v3/technical-records/plate', fakeAsync(() => {
        const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
        service.promoteTechnicalRecord$(technicalRecord.systemNumber, technicalRecord.createdTimestamp, 'reason').subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/promote/HGV/${technicalRecord.createdTimestamp}`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toHaveProperty('reasonForPromoting');
      }));
    });

    describe('amendVrm', () => {
      it('should call v3/technical-records/updateVrm', fakeAsync(() => {
        const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
        service.amendVrm$('new vrm', false, technicalRecord.systemNumber, technicalRecord.createdTimestamp).subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/updateVrm/HGV/${technicalRecord.createdTimestamp}`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toHaveProperty('newVrm');
        expect(req.request.body).toHaveProperty('isCherishedTransfer');
      }));
    });

    describe('getRecordV3', () => {
      it('should call v3/technical-records/plate/HGV', fakeAsync(() => {
        const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
        service.getRecordV3$(technicalRecord.systemNumber, technicalRecord.createdTimestamp).subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/HGV/${technicalRecord.createdTimestamp}`);
        expect(req.request.method).toBe('GET');
      }));
    });

    describe('getBySystemNumber', () => {
      it('should call service.search$', fakeAsync(() => {
        const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
        jest.spyOn(service, 'search$').mockReturnValue(of());
        service.getBySystemNumber$(technicalRecord.systemNumber).subscribe();
        expect(service.search$).toHaveBeenCalled();
      }));
    });

    describe('searchBy', () => {
      it('should call store.dispatch', fakeAsync(() => {
        jest.spyOn(store, 'dispatch');
        service.searchBy(SEARCH_TYPES.ALL, 'term');
        expect(store.dispatch).toHaveBeenCalledWith(fetchSearchResult({ searchBy: SEARCH_TYPES.ALL, term: 'term' }));
      }));
    });

    describe('search$', () => {
      it('should call v3/technical-records/search', fakeAsync(() => {
        service.search$(SEARCH_TYPES.ALL, 'term').subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/term?searchCriteria=${SEARCH_TYPES.ALL}`);
        expect(req.request.method).toBe('GET');
      }));
    });
  });
});
