import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { ReferenceDataService } from './reference-data.service';
import { testCases } from '@store/reference-data/reference-data.test-cases';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReferenceDataApiResponse, ReferenceDataApiService } from '@api/reference-data';
import { of } from 'rxjs';

describe('TechnicalRecordService', () => {
  let service: ReferenceDataService;
  let apiService: ReferenceDataApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReferenceDataService, ReferenceDataApiService, provideMockStore({ initialState: initialAppState })]
    });

    service = TestBed.inject(ReferenceDataService);
    apiService = TestBed.inject(ReferenceDataApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('API', () => {
    describe('resourceTypes', () => {
      it.each(testCases)('should return all data for a given resourceType', (value, done: any) => {
        const apiResponse: ReferenceDataApiResponse = { data: value.payload };
        service.fetchReferenceData(value.resourceType).subscribe(response => {
          expect(response).toEqual(apiResponse);
          done();
        });
      });
    });

    it('should thrown an error if resource type is not given', done => {
      service.fetchReferenceData(undefined as any).subscribe({
        error: e => {
          expect(e.message).toBe('Reference data resourceType is required');
          done();
        }
      });
    });

    it('should thrown an error if resource type is not valid', done => {
      service.fetchReferenceData('NOT_SUPPORTED' as any).subscribe({
        error: e => {
          expect(e.message).toBe('Unknown reference data resourceType');
          done();
        }
      });
    });
  });

  describe('resourceKeys', () => {
    it.each(testCases)('should return one result for a given resourceType and resourceKey', (value, done: any) => {
      const { resourceType, resourceKey, payload } = value;
      const expectedResult: ReferenceDataApiResponse = { data: [payload.find(p => p.resourceKey === resourceKey)!] };

      service.fetchReferenceData(resourceType, resourceKey).subscribe(response => {
        expect(response).toEqual(expectedResult);
        done();
      });
    });

    it.each(testCases)('should thrown an error if resource key is not valid', (value, done: any) => {
      service.fetchReferenceData(value.resourceType, 'NOT_FOUND').subscribe({
        error: e => {
          expect(e.message).toBe('Reference data with specified resource key not found (404)');
          done();
        }
      });
    });
  });

  it.each(testCases)('should get all of the reference data', value => {
    service.getAll$(value.resourceType).subscribe(response => {
      expect(response).toEqual(value.payload);
    });
  });

  it.each(testCases)('should get a specific reference data record', value => {
    const { resourceType, resourceKey, payload } = value;
    const expectedResult = payload.find(p => p.resourceKey === resourceKey);

    service.getByKey$(resourceType, resourceKey).subscribe(response => {
      expect(response).toEqual(expectedResult);
    });
  });
});
