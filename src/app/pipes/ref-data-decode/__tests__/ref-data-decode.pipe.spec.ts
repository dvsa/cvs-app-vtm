import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { STORE_FEATURE_REFERENCE_DATA_KEY, initialReferenceDataState } from '@store/reference-data';
import { RefDataDecodePipe } from '../ref-data-decode.pipe';

describe('RefDataDecodePipe', () => {
	let store: MockStore<State>;
	let pipe: RefDataDecodePipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [BrowserModule],
			providers: [provideMockStore({ initialState: initialAppState }), RefDataDecodePipe],
		});

		store = TestBed.inject(MockStore);
		pipe = TestBed.inject(RefDataDecodePipe);

		store.setState({
			...initialAppState,
			[STORE_FEATURE_REFERENCE_DATA_KEY]: {
				...initialReferenceDataState,
				[ReferenceDataResourceType.CountryOfRegistration]: {
					ids: ['gb'],
					entities: {
						gb: {
							resourceType: ReferenceDataResourceType.CountryOfRegistration,
							resourceKey: 'gb',
							description: 'Great Britain',
						},
					},
					loading: false,
				},
				[`${ReferenceDataResourceType.CountryOfRegistration}#AUDIT` as ReferenceDataResourceType]: {
					searchReturn: [
						{
							resourceType: `${ReferenceDataResourceType.CountryOfRegistration}#AUDIT` as ReferenceDataResourceType,
							resourceKey: 'a',
							description: 'Austria',
						},
					],
					loading: false,
				},
				[ReferenceDataResourceType.Tyres]: {
					ids: ['101'],
					entities: {
						101: {
							resourceType: ReferenceDataResourceType.Tyres,
							resourceKey: '101',
							tyreSize: '235/75-17.5',
						} as ReferenceDataTyre,
					},
					loading: false,
				},
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		store.refreshState();
	});

	it('should return description', (done) => {
		pipe.transform('gb', ReferenceDataResourceType.CountryOfRegistration).subscribe((val) => {
			expect(val).toBe('Great Britain');
			done();
		});
	});

	it('should return description of deleted item', (done) => {
		pipe.transform('a', ReferenceDataResourceType.CountryOfRegistration).subscribe((val) => {
			expect(val).toBe('Austria');
			done();
		});
	});

	it('should return tyreSize', (done) => {
		pipe.transform('101', ReferenceDataResourceType.Tyres, 'tyreSize').subscribe((val) => {
			expect(val).toBe('235/75-17.5');
			done();
		});
	});

	it('should return untransformed value when description is undefined', (done) => {
		pipe.transform('101', ReferenceDataResourceType.Tyres).subscribe((val) => {
			expect(val).toBe('101');
			done();
		});
	});

	it('should return untransformed value when value is not a known resourceKey', (done) => {
		pipe.transform('foo', ReferenceDataResourceType.Tyres, 'tyreSize').subscribe((val) => {
			expect(val).toBe('foo');
			done();
		});
	});

	it('should return untransformed value when value is falsy', (done) => {
		pipe.transform('', ReferenceDataResourceType.Tyres, 'tyreSize').subscribe((val) => {
			expect(val).toBe('');
			done();
		});
	});

	it('should return untransformed value when resourceType is falsy', (done) => {
		pipe.transform('101', '', 'tyreSize').subscribe((val) => {
			expect(val).toBe('101');
			done();
		});
	});

	it('should return untransformed value when data not in state', (done) => {
		pipe.transform('bar', 'baz').subscribe((val) => {
			expect(val).toBe('bar');
			done();
		});
	});
});
