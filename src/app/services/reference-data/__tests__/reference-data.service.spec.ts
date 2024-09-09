import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReferenceDataApiResponse, ReferenceDataItem } from '@api/reference-data';
import { MultiOptions } from '@models/options.model';
import {
	ReferenceDataModelBase,
	ReferenceDataResourceType,
	ReferenceDataTyre,
	User,
} from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import {
	ReferenceDataEntityStateSearch,
	STORE_FEATURE_REFERENCE_DATA_KEY,
	addSearchInformation,
	fetchReferenceData,
	fetchReferenceDataByKeySearch,
	fetchTyreReferenceDataByKeySearch,
	initialReferenceDataState,
	referencePsvMakeLoadingState,
	removeTyreSearch,
	selectTyreSearchCriteria,
} from '@store/reference-data';
import { testCases } from '@store/reference-data/reference-data.test-cases';
import { firstValueFrom, of, take } from 'rxjs';
import { ReferenceDataService } from '../reference-data.service';

describe('ReferenceDataService', () => {
	let service: ReferenceDataService;
	let controller: HttpTestingController;
	let store: MockStore;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{ provide: UserService, useValue: { id$: of('id'), name$: of('Jack') } },
			],
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
			it.each(testCases)('should return all data for a given resourceType', (value) => {
				const apiResponse: ReferenceDataApiResponse = { data: value.payload };
				service.fetchReferenceData(value.resourceType).subscribe((response) => {
					expect(response).toEqual(apiResponse);
				});

				const req = controller.expectOne('https://url/api/v1/reference/COUNTRY_OF_REGISTRATION');
				req.flush(apiResponse);
			});
		});

		it('should thrown an error if resource type is not given', (done) => {
			service.fetchReferenceData(undefined as unknown as ReferenceDataResourceType).subscribe({
				error: (e) => {
					expect(e.message).toBe('Reference data resourceType is required');
					done();
				},
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
						plyRating: '18',
					},
				],
			};
			const apiResponse: ReferenceDataApiResponse = { data: value.payload };
			service.fetchReferenceDataByKeySearch(ReferenceDataResourceType.Tyres, '101').subscribe((data) => {
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
						plyRating: '18',
					},
				],
			};
			const apiResponse: ReferenceDataApiResponse = { data: value.payload };
			service.fetchTyreReferenceDataByKeySearch('plyrating', '10').subscribe((data) => {
				expect(data).toEqual(apiResponse);
			});

			const req = controller.expectOne('https://url/api/v1/reference/lookup/tyres/plyrating/10');
			req.flush(apiResponse);
		});
	});

	describe('resourceKeys', () => {
		it.each(testCases)('should return one result for a given resourceType and resourceKey', (value) => {
			const getOneFromResourceSpy = jest.spyOn(service, 'referenceResourceTypeResourceKeyGet');
			const { resourceType, resourceKey, payload } = value;
			const resource = payload.find((p) => p.resourceKey === resourceKey) as ReferenceDataItem;
			expect(resource).toBeDefined();
			const expectedResult: ReferenceDataApiResponse = { data: [resource] };

			service.fetchReferenceDataByKey(resourceType, resourceKey).subscribe((response) => {
				expect(response).toEqual(expectedResult);
				expect(getOneFromResourceSpy).toHaveBeenCalled();
			});

			const req = controller.expectOne('https://url/api/v1/reference/COUNTRY_OF_REGISTRATION/gb');
			req.flush(expectedResult);
		});
	});
	describe('createReferenceDataItem', () => {
		it('should return the created item', () => {
			const resourceType = ReferenceDataResourceType.CountryOfRegistration;
			const resourceKey = 'testKey';
			const item = { description: 'test Item' };
			const apiResponse = { resourceType, resourceKey, ...item };
			service.createReferenceDataItem(resourceType, resourceKey, item).subscribe((data) => {
				expect(data).toEqual(item);
			});

			const req = controller.expectOne(`https://url/api/v1/reference/${resourceType}/${resourceKey}`);
			expect(req.request.method).toBe('POST');

			req.flush(apiResponse);
		});
	});

	describe('amendReferenceDataItem', () => {
		it('should return the amended item', () => {
			const resourceType = ReferenceDataResourceType.CountryOfRegistration;
			const resourceKey = 'testKey';
			const item = { description: 'test Item' };
			const apiResponse = { resourceType, resourceKey, ...item };
			service.amendReferenceDataItem(resourceType, resourceKey, item).subscribe((data) => {
				expect(data).toEqual(apiResponse);
			});

			const req = controller.expectOne(`https://url/api/v1/reference/${resourceType}/${resourceKey}`);
			expect(req.request.method).toBe('PUT');

			req.flush(apiResponse);
		});
	});

	describe('deleteReferenceDataItem', () => {
		it('should return a delete item', () => {
			const resourceType = ReferenceDataResourceType.CountryOfRegistration;
			const resourceKey = 'testKey';
			const apiResponse = { success: 'true' };
			service.deleteReferenceDataItem(resourceType, resourceKey, { createdId: 'test' }).subscribe((data) => {
				expect(data).toEqual(apiResponse);
			});
			const req = controller.expectOne(`https://url/api/v1/reference/${resourceType}/${resourceKey}`);
			expect(req.request.method).toBe('DELETE');

			req.flush(apiResponse);
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
								description: 'Great Britain and Northern Ireland - GB',
							},
							gba: {
								resourceType: ReferenceDataResourceType.CountryOfRegistration,
								resourceKey: 'gba',
								description: 'Alderney - GBA',
							},
						},
					},
					[ReferenceDataResourceType.ReasonsForAbandoningPsv]: {
						ids: ['foobar'],
						entities: {
							foobar: {
								resourceType: ReferenceDataResourceType.ReasonsForAbandoningPsv,
								resourceKey: 'foobar',
							},
						},
					},
				},
			});
		});

		it('should get all of the reference data', (done) => {
			service.getAll$(ReferenceDataResourceType.CountryOfRegistration).subscribe((response) => {
				expect(response).toEqual([
					{
						resourceType: ReferenceDataResourceType.CountryOfRegistration,
						resourceKey: 'gb',
						description: 'Great Britain and Northern Ireland - GB',
					},
					{
						resourceType: ReferenceDataResourceType.CountryOfRegistration,
						resourceKey: 'gba',
						description: 'Alderney - GBA',
					},
				]);
				done();
			});
		});

		it('should get a specific reference data record', (done) => {
			service.getByKey$(ReferenceDataResourceType.CountryOfRegistration, 'gba').subscribe((response) => {
				expect(response).toEqual({
					resourceType: ReferenceDataResourceType.CountryOfRegistration,
					resourceKey: 'gba',
					description: 'Alderney - GBA',
				});
				done();
			});
		});

		it('should get the tyre search results', (done) => {
			const mockReferenceDataTyre = [{ code: 'foo' }] as ReferenceDataTyre[];
			jest.spyOn(service, 'getTyreSearchReturn$').mockReturnValue(of(mockReferenceDataTyre));
			service
				.getTyreSearchReturn$()
				.pipe(take(1))
				.subscribe((referenceData) => {
					expect(referenceData).toEqual(mockReferenceDataTyre);
					done();
				});
		});
		it('should get the tyre search criteria', (done) => {
			const mockState = { loading: false } as ReferenceDataEntityStateSearch;
			store.overrideSelector(selectTyreSearchCriteria, mockState);
			service
				.getTyreSearchCriteria$()
				.pipe(take(1))
				.subscribe((referenceData) => {
					expect(referenceData).toEqual(mockState);
					done();
				});
		});
		it('should get the psv make reference data loading', (done) => {
			store.overrideSelector(referencePsvMakeLoadingState, false);
			service
				.getReferencePsvMakeDataLoading$()
				.pipe(take(1))
				.subscribe((loadingFlag) => {
					expect(loadingFlag).toBe(false);
					done();
				});
		});

		it('should get the data from state and format the response', (done) => {
			service
				.getReferenceDataOptions(ReferenceDataResourceType.CountryOfRegistration)
				.pipe(take(1))
				.subscribe((data) => {
					expect(data).toEqual([
						{ label: 'Great Britain and Northern Ireland - GB', value: 'gb' },
						{ label: 'Alderney - GBA', value: 'gba' },
					]);
					done();
				});
		});
		it('should get the psv data from state and format the response', (done) => {
			service
				.getReasonsForAbandoning(VehicleTypes.PSV)
				.pipe(take(1))
				.subscribe((data) => {
					expect(data).toEqual([{ label: 'foobar', value: 'foobar' }]);
					done();
				});
		});

		it('should return if vehicle Type if undefined', (done) => {
			service
				.getReasonsForAbandoning(undefined)
				.pipe(take(1))
				.subscribe((data) => {
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
							resourceType: ReferenceDataResourceType.Brakes,
							resourceKey: 'banana',
							description: 'yellow',
						},
					] as ReferenceDataModelBase[],
					output: [{ label: 'yellow', value: 'banana' }] as MultiOptions,
				},
				{
					refData: [
						{
							resourceType: ReferenceDataResourceType.User,
							resourceKey: 'mike@mail.com',
							name: 'Mike',
						},
					] as Array<ReferenceDataModelBase & Partial<User>>,
					output: [{ label: 'Mike', value: 'mike@mail.com' }],
				},
				{
					refData: [
						{
							resourceType: ReferenceDataResourceType.User,
							resourceKey: 'mike@mail.com',
						},
					] as Array<ReferenceDataModelBase & Partial<User>>,
					output: [{ label: 'mike@mail.com', value: 'mike@mail.com' }],
				},
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
					fetchReferenceDataByKeySearch({
						resourceType: ReferenceDataResourceType.CountryOfRegistration,
						resourceKey: 'foo',
					})
				);
			});
		});
		describe('loadTyreReferenceDataByKeySearch', () => {
			it('should dispatch the action to loadTyreReferenceDataByKeySearch', () => {
				const dispatchSpy = jest.spyOn(store, 'dispatch');
				service.loadTyreReferenceDataByKeySearch('foo', 'bar');
				expect(dispatchSpy).toHaveBeenCalledWith(
					fetchTyreReferenceDataByKeySearch({ searchFilter: 'foo', searchTerm: 'bar' })
				);
			});
		});
	});

	describe('store methods', () => {
		it('should dispatch the fetchReferenceData action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			service.loadReferenceData(ReferenceDataResourceType.CountryOfRegistration);
			expect(dispatchSpy).toHaveBeenCalledWith(
				fetchReferenceData({ resourceType: ReferenceDataResourceType.CountryOfRegistration })
			);
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
