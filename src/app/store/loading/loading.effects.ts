import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { fetchDefects, fetchDefectsComplete, fetchDefectsFailed, fetchDefectsSuccess } from '../defects';
import {
	fetchFeatureFlagsFailure,
	fetchFeatureFlagsSuccess,
	fetchRemoteFeatureFlags,
} from '../feature-flags/feature-flags.actions';
import {
	fetchReferenceData,
	fetchReferenceDataComplete,
	fetchReferenceDataFailed,
	fetchReferenceDataSuccess,
} from '../reference-data';
import {
	getRequiredStandards,
	getRequiredStandardsComplete,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from '../required-standards/required-standards.actions';
import {
	fetchSearchResult,
	fetchSearchResultFailed,
	fetchSearchResultSuccess,
} from '../tech-record-search/tech-record-search.actions';
import {
	fetchTestStation,
	fetchTestStations,
	fetchTestStationsComplete,
	fetchTestStationsFailed,
	fetchTestStationsSuccess,
} from '../test-stations';
import {
	fetchTestTypes,
	fetchTestTypesComplete,
	fetchTestTypesFailed,
	fetchTestTypesSuccess,
} from '../test-types/test-types.actions';
import { startLoading, stopLoading } from './loading.actions';

@Injectable()
export class LoadingEffects {
	store = inject(Store);
	actions = inject(Actions);

	onStartLoading = createEffect(() =>
		this.actions.pipe(
			ofType(
				// TODO: add { meta: { startLoading: true } } to these actions, and use a global filter
				fetchTestStations,
				fetchTestStation,
				fetchTestTypes,
				fetchReferenceData,
				fetchRemoteFeatureFlags,
				fetchDefects,
				getRequiredStandards,
				fetchSearchResult
			),
			map(() => startLoading())
		)
	);

	onStopLoading = createEffect(() =>
		this.actions.pipe(
			ofType(
				// TODO: add { meta: { stopLoading: true } } to these actions, and use a global filter
				fetchTestStationsSuccess,
				fetchTestStationsFailed,
				fetchTestStationsComplete,
				fetchTestTypesSuccess,
				fetchTestTypesFailed,
				fetchTestTypesComplete,
				fetchReferenceDataSuccess,
				fetchReferenceDataFailed,
				fetchReferenceDataComplete,
				fetchFeatureFlagsSuccess,
				fetchFeatureFlagsFailure,
				fetchDefectsSuccess,
				fetchDefectsFailed,
				fetchDefectsComplete,
				getRequiredStandardsSuccess,
				getRequiredStandardsFailure,
				getRequiredStandardsComplete,
				fetchSearchResultSuccess,
				fetchSearchResultFailed
			),
			map(() => stopLoading())
		)
	);
}
