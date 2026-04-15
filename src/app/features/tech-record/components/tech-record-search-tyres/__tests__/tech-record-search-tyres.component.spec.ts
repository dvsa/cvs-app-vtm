import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from '@shared/custom-module/fixNgZoneError';

import { State, initialAppState } from '@store/index';
import { fetchReferenceDataByKeySearchSuccess } from '@store/reference-data';
import { Observable, ReplaySubject, of } from 'rxjs';
import { TechRecordSearchTyresComponent } from '../tech-record-search-tyres.component';

const mockGlobalErrorService = {
	addError: vi.fn(),
	clearErrors: vi.fn(),
};
const mockTechRecordService = {
	get techRecord$() {
		return of({});
	},
};
const mockReferenceDataService = {
	addSearchInformation: vi.fn(),
	getTyreSearchReturn$: vi.fn(),
	getTyreSearchCriteria$: vi.fn(),
	loadReferenceDataByKeySearch: vi.fn(),
	loadTyreReferenceDataByKeySearch: vi.fn(),
	loadReferenceData: vi.fn(),
	getAll$: vi.fn(),
};
const mockDynamicFormService = {
	createForm: vi.fn(),
};

describe('TechRecordSearchTyresComponent', () => {
	let component: TechRecordSearchTyresComponent;
	let fixture: ComponentFixture<TechRecordSearchTyresComponent>;
	const actions$ = new ReplaySubject<Action>();
	let router: Router;
	let route: ActivatedRoute;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TechRecordSearchTyresComponent, FixNavigationTriggeredOutsideAngularZoneNgModule],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ReferenceDataService, useValue: mockReferenceDataService },
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
				{ provide: DynamicFormService, useValue: mockDynamicFormService },
				{ provide: GlobalErrorService, useValue: mockGlobalErrorService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TechRecordSearchTyresComponent);
		router = TestBed.inject(Router);
		route = TestBed.inject(ActivatedRoute);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should return roles', () => {
		const { roles } = component;
		expect(roles).toBe(Roles);
	});
	it('should return errors', () => {
		const expectedError: GlobalError = { error: 'Error message', anchorLink: 'expected' };
		const expectedResult = component.getErrorByName([expectedError], expectedError.anchorLink ?? '');
		expect(expectedResult).toBe(expectedError);
	});

	describe('handleSearch', () => {
		it('should set search results to an empty array before populating data', () => {
			component.handleSearch('', '');
			expect(component.searchResults).toStrictEqual([]);
		});
		it('should call add error in global error service when term is empty', () => {
			const filter = 'code';
			component.handleSearch('', filter);
			expect(mockGlobalErrorService.addError).toHaveBeenCalled();
		});
		it('should call add error in global error service when filter is empty', () => {
			const term = '103';
			component.handleSearch(term, '');
			expect(mockGlobalErrorService.addError).toHaveBeenCalled();
		});
		it('should call correct endpoint if filter === code', () => {
			const filter = 'code';
			const term = '103';
			component.handleSearch(filter, term);
			expect(mockReferenceDataService.loadReferenceDataByKeySearch).toHaveBeenCalledWith(
				ReferenceDataResourceType.Tyres,
				term
			);
		});
		it('should call correct endpoint if filter === plyrating', () => {
			const filter = 'plyrating';
			const term = '103';
			component.handleSearch(filter, term);
			expect(mockReferenceDataService.loadTyreReferenceDataByKeySearch).toHaveBeenCalledWith(filter, term);
		});
		it('should call correct endpoint if filter === singleload', () => {
			const filter = 'singleload';
			const term = '103';
			component.handleSearch(filter, term);
			expect(mockReferenceDataService.loadTyreReferenceDataByKeySearch).toHaveBeenCalledWith(filter, term);
		});
		it('should call correct endpoint if filter === doubleload', () => {
			const filter = 'doubleload';
			const term = '103';
			component.handleSearch(filter, term);
			expect(mockReferenceDataService.loadTyreReferenceDataByKeySearch).toHaveBeenCalledWith(filter, term);
		});
		it('should navigate and populate the search results on success action', fakeAsync(() => {
			const navigateSpy = vi.spyOn(router, 'navigate');
			const mockTyreSearchReturn = ['foo', 'bar'];

			vi.spyOn(store, 'select').mockReturnValue(of(mockTyreSearchReturn));
			component.handleSearch('foo', 'bar');

			expect(mockReferenceDataService.loadTyreReferenceDataByKeySearch).toHaveBeenCalledWith('foo', 'bar');
			actions$.next(fetchReferenceDataByKeySearchSuccess);

			tick();

			expect(navigateSpy).toHaveBeenCalledWith(['.'], { relativeTo: route, queryParams: { 'search-results-page': 1 } });
			expect(component.searchResults).toEqual(mockTyreSearchReturn);
		}));

		const testCases = [
			{ filter: '', term: 'foo' },
			{ filter: 'foo', term: '' },
			{ filter: '', term: '' },
		];

		it.each(testCases)('should return early if the search information has not been provided', ({ filter, term }) => {
			vi.resetAllMocks();
			const refDataServiceSpy = vi.spyOn(mockReferenceDataService, 'addSearchInformation');
			const errorServiceSpy = vi.spyOn(mockGlobalErrorService, 'addError');
			component.handleSearch(filter, term);
			expect(refDataServiceSpy).not.toHaveBeenCalled();
			expect(errorServiceSpy).toHaveBeenCalledWith({
				error: expect.stringContaining(term ? 'filter' : 'criteria'),
				anchorLink: 'term',
			});
		});
	});

	describe('handleSelectTyreData', () => {
		it('should have a truthy value for vehicle tech record', () => {
			const tyre: ReferenceDataTyre = {
				code: '103',
				loadIndexSingleLoad: '0',
				tyreSize: '0',
				dateTimeStamp: '0',
				userId: '0',
				loadIndexTwinLoad: '0',
				plyRating: '18',
				resourceType: ReferenceDataResourceType.Tyres,
				resourceKey: '103',
			};
			component.handleAddTyreToRecord(tyre);
			expect(mockTechRecordService.techRecord$).toBeTruthy();
		});
		it('should clear global errors', () => {
			const tyre: ReferenceDataTyre = {
				code: '103',
				loadIndexSingleLoad: '0',
				tyreSize: '0',
				dateTimeStamp: '0',
				userId: '0',
				loadIndexTwinLoad: '0',
				plyRating: '18',
				resourceType: ReferenceDataResourceType.Tyres,
				resourceKey: '103',
			};
			component.handleAddTyreToRecord(tyre);
			expect(mockGlobalErrorService.clearErrors).toHaveBeenCalled();
		});
	});

	describe('The cancel function', () => {
		it('should clear global errors', () => {
			component.cancel();
			expect(mockGlobalErrorService.clearErrors).toHaveBeenCalled();
		});
	});

	describe('Getters', () => {
		it('should get the currentVrm', () => {
			const mockVehicleRecord = {
				primaryVrm: 'bar',
				secondaryVrms: ['foo'],
			} as V3TechRecordModel;
			component.vehicleTechRecord = mockVehicleRecord;
			expect(component.currentVrm).toBe('bar');
		});
		it('should get the paginated fields', () => {
			component.searchResults = ['foo', 'bar', 'foobar'] as unknown as ReferenceDataTyre[];
			expect(component.paginatedFields).toEqual(['foo', 'bar', 'foobar']);
		});
		it('should get the number of results', () => {
			component.searchResults = ['foo', 'bar', 'foobar'] as unknown as ReferenceDataTyre[];
			expect(component.numberOfResults).toEqual(component.searchResults?.length);
		});
	});

	describe('OnInit', () => {
		it('should patch the form with the search criteria and the search return', () => {
			const mockForm = {
				controls: {
					filter: {
						patchValue: vi.fn(),
					},
					term: {
						patchValue: vi.fn(),
					},
				},
			};
			const mockTyreSearchReturn = ['foobar'];
			const mockSearchCriteria = { filter: 'foo', term: 'bar' };
			const dfsSpy = vi.spyOn(mockDynamicFormService, 'createForm').mockReturnValue(mockForm);
			vi.spyOn(mockReferenceDataService, 'getTyreSearchReturn$').mockReturnValue(of(mockTyreSearchReturn));
			vi.spyOn(mockReferenceDataService, 'getTyreSearchCriteria$').mockReturnValue(of(mockSearchCriteria));
			const filterSpy = vi.spyOn(mockForm.controls.filter, 'patchValue');
			const termSpy = vi.spyOn(mockForm.controls.term, 'patchValue');
			component.ngOnInit();
			expect(dfsSpy).toHaveBeenCalledWith(component.template);
			expect(filterSpy).toHaveBeenCalledWith(mockSearchCriteria.filter);
			expect(termSpy).toHaveBeenCalledWith(mockSearchCriteria.term);
			expect(component.searchResults).toEqual(mockTyreSearchReturn);
		});
		it('should navigate if there is no viewable tech record', () => {
			const routerSpy = vi.spyOn(router, 'navigate');
			vi
				.spyOn(mockTechRecordService, 'techRecord$', 'get')
				.mockReturnValue(of(undefined) as unknown as Observable<Record<string, unknown>>);
			component.ngOnInit();
			expect(routerSpy).toHaveBeenCalledWith(['../..'], { relativeTo: route });
		});
	});
});
