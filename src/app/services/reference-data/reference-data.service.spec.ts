import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReferenceDataApiResponse, ReferenceDataService as ReferenceDataApiService } from '@api/reference-data';
import { MultiOptions } from '@forms/models/options.model';
import { ReferenceDataModelBase, ReferenceDataResourceType, ReferenceDataTyre, User } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import {
  addSearchInformation,
  fetchReferenceData,
  fetchReferenceDataByKeySearch,
  fetchTyreReferenceDataByKeySearch,
  initialReferenceDataState,
  ReferenceDataEntityStateTyres,
  referencePsvMakeLoadingState,
  removeTyreSearch,
  selectAllReferenceDataByResourceType,
  selectTyreSearchCriteria,
  selectTyreSearchReturn,
  STORE_FEATURE_REFERENCE_DATA_KEY
} from '@store/reference-data';
import { testCases } from '@store/reference-data/reference-data.test-cases';
import { firstValueFrom, of, take } from 'rxjs';
import { ReferenceDataService } from './reference-data.service';

describe('ReferenceDataService', () => {
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

  describe('fetchReferenceDataByKeySearch', () => {
    it('should call the correct end point', () => {
      const value = {
        payload: [
          {
            tyreCode: '123',
            resourceType: ReferenceDataResourceType.Tyres,
            resourceKey: '123',
            code: '123',
            loadIndexSingleLoad: '102',
            tyreSize: 'size',
            dateTimeStamp: 'time',
            userId: '1234',
            loadIndexTwinLoad: '101',
            plyRating: '18'
          }
        ]
      };
      const apiResponse: ReferenceDataApiResponse = { data: value.payload };
      service.fetchReferenceDataByKeySearch(ReferenceDataResourceType.Tyres, '101').subscribe(data => {
        expect(data).toEqual(apiResponse);
      });

      const req = controller.expectOne('https://url/api/v1/reference/lookup/TYRES/101');
      req.flush(apiResponse);
    });
  });

  describe('fetchTyreReferenceDataByKeySearch', () => {
    it('should call the correct end point', () => {
      const value = {
        payload: [
          {
            tyreCode: '123',
            resourceType: ReferenceDataResourceType.Tyres,
            resourceKey: '123',
            code: '123',
            loadIndexSingleLoad: '102',
            tyreSize: 'size',
            dateTimeStamp: 'time',
            userId: '1234',
            loadIndexTwinLoad: '101',
            plyRating: '18'
          }
        ]
      };
      const apiResponse: ReferenceDataApiResponse = { data: value.payload };
      service.fetchTyreReferenceDataByKeySearch('plyrating', '10').subscribe(data => {
        expect(data).toEqual(apiResponse);
      });

      const req = controller.expectOne('https://url/api/v1/reference/lookup/tyres/plyrating/10');
      req.flush(apiResponse);
    });
  });

  describe('resourceKeys', () => {
    it.each(testCases)('should return one result for a given resourceType and resourceKey', value => {
      const getOneFromResourceSpy = jest.spyOn(service, 'referenceResourceTypeResourceKeyGet');
      const { resourceType, resourceKey, payload } = value;
      const expectedResult: ReferenceDataApiResponse = { data: [payload.find(p => p.resourceKey === resourceKey)!] };

      service.fetchReferenceDataByKey(resourceType, resourceKey).subscribe(response => {
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
          },
          [ReferenceDataResourceType.ReasonsForAbandoningPsv]: {
            ids: ['foobar'],
            entities: {
              foobar: {
                resourceType: ReferenceDataResourceType.ReasonsForAbandoningPsv,
                resourceKey: 'foobar'
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

    it('should get the tyre search results', done => {
      const mockReferenceDataTyre = [{ code: 'foo' }] as ReferenceDataTyre[];
      store.overrideSelector(selectTyreSearchReturn, mockReferenceDataTyre);
      service
        .getTyreSearchReturn$()
        .pipe(take(1))
        .subscribe(referenceData => {
          expect(referenceData).toEqual(mockReferenceDataTyre);
          done();
        });
    });
    it('should get the tyre search criteria', done => {
      const mockState = { loading: false } as ReferenceDataEntityStateTyres;
      store.overrideSelector(selectTyreSearchCriteria, mockState);
      service
        .getTyreSearchCriteria$()
        .pipe(take(1))
        .subscribe(referenceData => {
          expect(referenceData).toEqual(mockState);
          done();
        });
    });
    it('should get the psv make reference data loading', done => {
      store.overrideSelector(referencePsvMakeLoadingState, false);
      service
        .getReferencePsvMakeDataLoading$()
        .pipe(take(1))
        .subscribe(loadingFlag => {
          expect(loadingFlag).toBe(false);
          done();
        });
    });

    it('should get the data from state and format the response', done => {
      service
        .getReferenceDataOptions(ReferenceDataResourceType.CountryOfRegistration)
        .pipe(take(1))
        .subscribe(data => {
          expect(data).toEqual([
            { label: 'Great Britain and Northern Ireland - GB', value: 'gb' },
            { label: 'Alderney - GBA', value: 'gba' }
          ]);
          done();
        });
    });
    it('should get the data from state and format the response', done => {
      service
        .getReasonsForAbandoning(VehicleTypes.PSV)
        .pipe(take(1))
        .subscribe(data => {
          expect(data).toEqual([{ label: 'foobar', value: 'foobar' }]);
          done();
        });
    });

    it('should return if vehicle Type if undefined', done => {
      service
        .getReasonsForAbandoning(undefined)
        .pipe(take(1))
        .subscribe(data => {
          expect(data).toEqual([]);
          done();
        });
    });
  });

  describe('helper function', () => {
    describe('mapReferenceDataOptions', () => {
      it.each([
        {
          refData: [
            {
              resourceType: ReferenceDataResourceType.Brake,
              resourceKey: 'banana',
              description: 'yellow'
            }
          ] as ReferenceDataModelBase[],
          output: [{ label: 'yellow', value: 'banana' }] as MultiOptions
        },
        {
          refData: [
            {
              resourceType: ReferenceDataResourceType.User,
              resourceKey: 'mike@mail.com',
              name: 'Mike'
            }
          ] as Array<ReferenceDataModelBase & Partial<User>>,
          output: [{ label: 'Mike', value: 'mike@mail.com' }]
        },
        {
          refData: [
            {
              resourceType: ReferenceDataResourceType.User,
              resourceKey: 'mike@mail.com'
            }
          ] as Array<ReferenceDataModelBase & Partial<User>>,
          output: [{ label: 'mike@mail.com', value: 'mike@mail.com' }]
        }
      ])('should return MultiOption Array with description as label', async ({ refData, output }) => {
        const options = await firstValueFrom(of(refData).pipe(take(1), service['mapReferenceDataOptions']));
        expect(options).toEqual(output);
      });
    });
  });

  describe('search methods', () => {
    describe('fetchReferenceDataByKeySearch', () => {
      it('should dispatch the action to fetchReferenceDataByKeySearch', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        service.loadReferenceDataByKeySearch(ReferenceDataResourceType.CountryOfRegistration, 'foo');
        expect(dispatchSpy).toHaveBeenCalledWith(
          fetchReferenceDataByKeySearch({ resourceType: ReferenceDataResourceType.CountryOfRegistration, resourceKey: 'foo' })
        );
      });
    });
    describe('loadTyreReferenceDataByKeySearch', () => {
      it('should dispatch the action to loadTyreReferenceDataByKeySearch', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        service.loadTyreReferenceDataByKeySearch('foo', 'bar');
        expect(dispatchSpy).toHaveBeenCalledWith(fetchTyreReferenceDataByKeySearch({ searchFilter: 'foo', searchTerm: 'bar' }));
      });
    });
  });

  describe('store methods', () => {
    it('should dispatch the fetchReferenceData action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      service.loadReferenceData(ReferenceDataResourceType.CountryOfRegistration);
      expect(dispatchSpy).toHaveBeenCalledWith(fetchReferenceData({ resourceType: ReferenceDataResourceType.CountryOfRegistration }));
    });
    it('should dispatch the addSearchInformation action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      service.addSearchInformation('foo', 'bar');
      expect(dispatchSpy).toHaveBeenCalledWith(addSearchInformation({ filter: 'foo', term: 'bar' }));
    });
    it('should dispatch the removeTyreSearch action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      service.removeTyreSearch();
      expect(dispatchSpy).toHaveBeenCalledWith(removeTyreSearch());
    });
  });
});
