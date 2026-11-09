import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { fetchDefectsComplete } from '../defects/defects.actions';
import { defectsReducer, initialDefectsState } from '../defects/defects.reducer';
import { fetchFeatureFlagsSuccess, updateFeatureFlags } from '../feature-flags/feature-flags.actions';
import { featureFlagsReducer } from '../feature-flags/feature-flags.reducer';
import { globalErrorReducer } from '../global-error/global-error-service.reducer';
import { patchErrors } from '../global-error/global-error.actions';
import {
	getRequiredStandardsComplete,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from '../required-standards/required-standards.actions';
import {
	initialRequiredStandardsState,
	requiredStandardsReducer,
} from '../required-standards/required-standards.reducer';
import { getRequiredStandardFromTypeAndRef } from '../required-standards/required-standards.selector';
import { createVehicleRecordFailure } from '../technical-records';
import { fetchTestStationsComplete } from '../test-stations/test-stations.actions';
import { initialTestStationsState, testStationsReducer } from '../test-stations/test-stations.reducer';
import { fetchTestTypesComplete } from '../test-types/test-types.actions';
import { initialTestTypeState, testTypesReducer } from '../test-types/test-types.reducer';

describe('NgRx state transitions', () => {
	it('replaces feature configuration on fetch and patches only supplied flags on updates', () => {
		const config = { testresultcreate: { enabled: true }, testresultamend: { enabled: false } };
		const loaded = featureFlagsReducer(null, fetchFeatureFlagsSuccess({ config }));
		expect(loaded).toEqual(config);
		const result = featureFlagsReducer(
			loaded,
			updateFeatureFlags({ changes: { testresultcreate: { enabled: false } } })
		);
		expect(result).toEqual({ testresultcreate: { enabled: false }, testresultamend: { enabled: false } });
		expect(config.testresultcreate.enabled).toBe(true);
		expect(featureFlagsReducer(null, updateFeatureFlags({ changes: { testresultcreate: { enabled: true } } }))).toEqual(
			{ testresultcreate: { enabled: true } }
		);
	});

	it('appends patched and batch-create errors without changing existing errors', () => {
		const state = { errors: [{ error: 'Existing error', anchorLink: 'existing' }] };
		const patched = globalErrorReducer(state, patchErrors({ errors: [{ error: 'Another error' }] }));
		expect(patched.errors).toEqual([...state.errors, { error: 'Another error' }]);
		expect(
			globalErrorReducer(
				patched,
				createVehicleRecordFailure({ vehicleRecord: {} as TechRecordType<'put'>, error: 'VIN already exists' })
			).errors
		).toEqual([...patched.errors, { error: 'VIN already exists' }]);
		expect(state.errors).toHaveLength(1);
	});

	it.each([
		['defects', defectsReducer, initialDefectsState, fetchDefectsComplete()],
		['test stations', testStationsReducer, initialTestStationsState, fetchTestStationsComplete()],
		['test types', testTypesReducer, initialTestTypeState, fetchTestTypesComplete()],
		['required standards', requiredStandardsReducer, initialRequiredStandardsState, getRequiredStandardsComplete()],
	] as const)('stops loading %s when the complete action arrives', (_label, reducer, initial, action) => {
		const state = { ...initial, loading: true };
		expect(reducer(state, action)).toEqual({ ...initial, loading: false });
		expect(state.loading).toBe(true);
	});

	it('stops required-standard loading on failure without losing existing manuals', () => {
		const state = { ...initialRequiredStandardsState, loading: true };
		expect(requiredStandardsReducer(state, getRequiredStandardsFailure({ error: 'Unavailable' }))).toEqual({
			...state,
			loading: false,
		});
	});

	it('orders both inspection types numerically without mutating the API payload', () => {
		const entries = [
			{ sectionNumber: '10', sectionDescription: 'Ten', requiredStandards: [] },
			{ sectionNumber: '2', sectionDescription: 'Two', requiredStandards: [] },
		];
		const manual = {
			euVehicleCategories: ['m1'],
			basic: Object.freeze([...entries]),
			normal: Object.freeze([...entries]),
		} as unknown as DefectGETRequiredStandards;
		const result = requiredStandardsReducer(undefined, getRequiredStandardsSuccess({ requiredStandards: manual }));
		expect(result.entities['m1']?.basic.map((section) => section.sectionNumber)).toEqual(['2', '10']);
		expect(result.entities['m1']?.normal.map((section) => section.sectionNumber)).toEqual(['2', '10']);
		expect(manual.basic.map((section) => section.sectionNumber)).toEqual(['10', '2']);
	});

	it('does not attempt a required-standard lookup without a reference', () => {
		expect(
			getRequiredStandardFromTypeAndRef('basic', '').projector({ basic: [], normal: [], euVehicleCategories: [] })
		).toBeUndefined();
	});
});
