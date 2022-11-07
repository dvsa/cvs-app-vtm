import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReferenceDataApiResponse, ReferenceDataApiService } from '@api/reference-data';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { initialReferenceDataState, STORE_FEATURE_REFERENCE_DATA_KEY } from '@store/reference-data';
import { testCases } from '@store/reference-data/reference-data.test-cases';
import { ReferenceDataService } from './reference-data.service';

describe('TechnicalRecordService', () => {
  let service: ReferenceDataService;
  let controller: HttpTestingController;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReferenceDataService, ReferenceDataApiService, provideMockStore({ initialState: initialAppState })]
    });

    service = TestBed.inject(ReferenceDataService);
    controller = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);

    controller.verify();
  });

  afterEach(() => {
    store.refreshState();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('API', () => {
    describe('resourceTypes', () => {
      it.each(testCases)('should return all data for a given resourceType', value => {
        const apiResponse: ReferenceDataApiResponse = { data: value.payload };
        service.fetchReferenceData(value.resourceType).subscribe(response => {
          expect(response).toEqual(apiResponse);
        });

        const req = controller.expectOne('https://url/api/v1/reference/COUNTRY_OF_REGISTRATION');
        req.flush(apiResponse);
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
  });

  describe('resourceKeys', () => {
    it.each(testCases)('should return one result for a given resourceType and resourceKey', value => {
      const getOneFromResourceSpy = jest.spyOn(service, 'getOneFromResource');
      const { resourceType, resourceKey, payload } = value;
      const expectedResult: ReferenceDataApiResponse = { data: [payload.find(p => p.resourceKey === resourceKey)!] };

      service.fetchReferenceData(resourceType, resourceKey).subscribe(response => {
        expect(response).toEqual(expectedResult);
        expect(getOneFromResourceSpy).toHaveBeenCalled();
      });

      const req = controller.expectOne('https://url/api/v1/reference/COUNTRY_OF_REGISTRATION/gb');
      req.flush(expectedResult);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.setState({
        ...initialAppState,
        [STORE_FEATURE_REFERENCE_DATA_KEY]: {
          ...initialReferenceDataState,
          [ReferenceDataResourceType.CountryOfRegistration]: {
            ids: ['gb', 'gba'],
            entities: {
              gb: {
                resourceType: ReferenceDataResourceType.CountryOfRegistration,
                resourceKey: 'gb',
                description: 'Great Britain and Northern Ireland - GB'
              },
              gba: {
                resourceType: ReferenceDataResourceType.CountryOfRegistration,
                resourceKey: 'gba',
                description: 'Alderney - GBA'
              }
            }
          }
        }
      });
    });

    it('should get all of the reference data', done => {
      service.getAll$(ReferenceDataResourceType.CountryOfRegistration).subscribe(response => {
        expect(response).toEqual([
          {
            resourceType: ReferenceDataResourceType.CountryOfRegistration,
            resourceKey: 'gb',
            description: 'Great Britain and Northern Ireland - GB'
          },
          {
            resourceType: ReferenceDataResourceType.CountryOfRegistration,
            resourceKey: 'gba',
            description: 'Alderney - GBA'
          }
        ]);
        done();
      });
    });

    it('should get a specific reference data record', (done: any) => {
      service.getByKey$(ReferenceDataResourceType.CountryOfRegistration, 'gba').subscribe(response => {
        expect(response).toEqual({
          resourceType: ReferenceDataResourceType.CountryOfRegistration,
          resourceKey: 'gba',
          description: 'Alderney - GBA'
        });
        done();
      });
    });
  });
});
