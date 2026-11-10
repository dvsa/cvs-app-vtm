import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { fetchReferenceDataSuccess } from '../reference-data.actions';
import {
	STORE_FEATURE_REFERENCE_DATA_KEY,
	initialReferenceDataState,
	referenceDataReducer,
} from '../reference-data.reducer';
import * as selectors from '../reference-data.selectors';

describe('Reference data selector behaviour', () => {
	const type = ReferenceDataResourceType.Brakes;
	const brake = { resourceType: type, resourceKey: 'B-1', description: 'Service brake', service: '50' };
	const root = (feature = initialReferenceDataState) => ({ [STORE_FEATURE_REFERENCE_DATA_KEY]: feature });

	it('looks up brakes and users by key from the correct feature slices', () => {
		const user = {
			resourceType: ReferenceDataResourceType.User,
			resourceKey: 'user-1',
			name: 'Examiner',
			email: 'examiner@example.com',
		};
		const state = root({
			...initialReferenceDataState,
			[type]: { ids: ['B-1'], entities: { 'B-1': brake }, loading: false },
			[ReferenceDataResourceType.User]: { ids: ['user-1'], entities: { 'user-1': user }, loading: false },
		});
		expect(selectors.selectBrakeByCode('B-1')(state)).toEqual(brake);
		expect(selectors.selectUserByResourceKey('user-1')(state)).toEqual(user);
		expect(selectors.selectUserByResourceKey('missing')(state)).toBeUndefined();
	});

	it.each([false, true])('reports the PSV-make loading state independently of other resources (%s)', (loading) => {
		const state = root({
			...initialReferenceDataState,
			[ReferenceDataResourceType.PsvMake]: { ...initialReferenceDataState[ReferenceDataResourceType.PsvMake], loading },
			[type]: { ...initialReferenceDataState[type], loading: true },
		});
		expect(selectors.referencePsvMakeLoadingState(state)).toBe(loading);
	});

	it('rejects an unsupported vehicle type when selecting abandonment reasons', () => {
		expect(() => selectors.selectReasonsForAbandoning(VehicleTypes.CAR)).toThrow('Unknown Vehicle Type');
	});

	it('ignores unknown resource types instead of dereferencing a missing entity adapter', () => {
		const unknown = 'UNKNOWN' as ReferenceDataResourceType;
		expect(selectors.selectAllReferenceDataByResourceType(unknown)(root())).toBeUndefined();
		expect(selectors.selectReferenceDataByResourceKey(unknown, 'key')(root())).toBeUndefined();
	});

	it('maps country descriptions and keys to options while skipping empty entity slots', () => {
		const countryType = ReferenceDataResourceType.CountryOfRegistration;
		const state = root({
			...initialReferenceDataState,
			[countryType]: {
				ids: ['gb', 'missing', 'fr'],
				loading: false,
				entities: {
					gb: { resourceType: countryType, resourceKey: 'gb', description: 'United Kingdom' },
					missing: undefined,
					fr: { resourceType: countryType, resourceKey: 'fr', description: 'France' },
				},
			},
		});
		expect(selectors.selectCountryOfRegistrationOptions(state)).toEqual([
			{ label: 'United Kingdom', value: 'gb' },
			{ label: 'France', value: 'fr' },
		]);
	});

	it.each(['service', 'SERVICE', 'SeRvIcE'])('matches descriptions case-insensitively (%s)', (term) => {
		const state = root({
			...initialReferenceDataState,
			[type]: {
				ids: ['B-1', 'missing', 'B-2'],
				entities: { 'B-1': brake, missing: undefined, 'B-2': { resourceType: type, resourceKey: 'B-2' } },
				loading: false,
			},
		});
		expect(selectors.selectRefDataBySearchTerm(term, type, 'description')(state)).toEqual([brake]);
	});

	it('matches numeric resource keys as text', () => {
		const item = { resourceType: type, resourceKey: 123 };
		const state = root({
			...initialReferenceDataState,
			[type]: { ids: [123], entities: { 123: item }, loading: false },
		});
		expect(selectors.selectRefDataBySearchTerm('23', type, 'resourceKey')(state)).toEqual([item]);
	});

	it('returns no search matches for an empty term or a missing resource', () => {
		expect(selectors.selectRefDataBySearchTerm('', type, 'description')(root())).toEqual([]);
		expect(
			selectors.selectRefDataBySearchTerm('brake', 'UNKNOWN' as ReferenceDataResourceType, 'description')(root())
		).toEqual([]);
	});

	it('sorts audit results newest first without mutating the state array', () => {
		const auditType = `${type}#AUDIT` as ReferenceDataResourceType;
		const items = Object.freeze([
			{ resourceType: type, resourceKey: 'B-1#2026-01-01' },
			{ resourceType: type, resourceKey: 'B-1#2026-11-09' },
			{ resourceType: type, resourceKey: 'B-1#2026-06-01' },
		]);
		const state = root({
			...initialReferenceDataState,
			[auditType]: {
				ids: [],
				entities: {},
				loading: false,
				searchReturn: items as unknown as ReferenceDataModelBase[],
			},
		});
		expect(
			selectors
				.selectSearchReturn(auditType)(state)
				?.map((item) => item.resourceKey)
		).toEqual(['B-1#2026-11-09', 'B-1#2026-06-01', 'B-1#2026-01-01']);
		expect(items.map((item) => item.resourceKey)).toEqual(['B-1#2026-01-01', 'B-1#2026-11-09', 'B-1#2026-06-01']);
	});

	it('preserves configured sort order when reference data is loaded', () => {
		const payload = [
			{ ...brake, resourceKey: 'last', sortOrder: 20 },
			{ ...brake, resourceKey: 'first', sortOrder: 5 },
		];
		const state = referenceDataReducer(
			undefined,
			fetchReferenceDataSuccess({ resourceType: type, payload, paginated: false })
		);
		expect(
			selectors
				.selectAllReferenceDataByResourceType(type)(root(state))
				?.map((item) => item.resourceKey)
		).toEqual(['first', 'last']);
		expect(payload.map((item) => item.resourceKey)).toEqual(['last', 'first']);
	});
});
