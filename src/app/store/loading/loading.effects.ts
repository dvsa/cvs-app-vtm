import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import {
	fetchDefect,
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsComplete,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from '../defects';
import {
	fetchFeatureFlagsFailure,
	fetchFeatureFlagsSuccess,
	fetchRemoteFeatureFlags,
} from '../feature-flags/feature-flags.actions';
import {
	fetchReferenceData,
	fetchReferenceDataAudit,
	fetchReferenceDataAuditFailed,
	fetchReferenceDataAuditSuccess,
	fetchReferenceDataByKey,
	fetchReferenceDataByKeyFailed,
	fetchReferenceDataByKeySearch,
	fetchReferenceDataByKeySearchFailed,
	fetchReferenceDataByKeySearchSuccess,
	fetchReferenceDataByKeySuccess,
	fetchReferenceDataComplete,
	fetchReferenceDataFailed,
	fetchReferenceDataSuccess,
	fetchTyreReferenceDataByKeySearch,
	fetchTyreReferenceDataByKeySearchFailed,
	fetchTyreReferenceDataByKeySearchSuccess,
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
	amendVin,
	amendVinFailure,
	amendVinSuccess,
	amendVrm,
	amendVrmFailure,
	amendVrmSuccess,
	archiveTechRecord,
	archiveTechRecordFailure,
	archiveTechRecordSuccess,
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	generateADRCertificate,
	generateADRCertificateFailure,
	generateADRCertificateSuccess,
	generateContingencyADRCertificate,
	generateLetter,
	generateLetterFailure,
	generateLetterSuccess,
	generatePlate,
	generatePlateFailure,
	generatePlateSuccess,
	getBySystemNumber,
	getBySystemNumberFailure,
	getBySystemNumberSuccess,
	promoteTechRecord,
	promoteTechRecordFailure,
	promoteTechRecordSuccess,
	unarchiveTechRecord,
	unarchiveTechRecordFailure,
	unarchiveTechRecordSuccess,
	updateTechRecord,
	updateTechRecordFailure,
	updateTechRecordSuccess,
} from '../technical-records';
import {
	createTestResult,
	createTestResultFailed,
	createTestResultSuccess,
	fetchSelectedTestResult,
	fetchSelectedTestResultFailed,
	fetchSelectedTestResultSuccess,
	fetchTestResults,
	fetchTestResultsBySystemNumber,
	fetchTestResultsBySystemNumberFailed,
	fetchTestResultsBySystemNumberSuccess,
	fetchTestResultsFailed,
	fetchTestResultsSuccess,
	getRecalls,
	getRecallsFailure,
	getRecallsSuccess,
	updateTestResult,
	updateTestResultFailed,
	updateTestResultSuccess,
} from '../test-records';
import {
	fetchTestStation,
	fetchTestStationFailed,
	fetchTestStationSuccess,
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
				fetchDefect,
				getRequiredStandards,
				fetchSearchResult,
				getRecalls,
				fetchTestResults,
				fetchTestResultsBySystemNumber,
				fetchSelectedTestResult,
				createTestResult,
				updateTestResult,
				createVehicleRecord,
				getBySystemNumber,
				updateTechRecord,
				archiveTechRecord,
				unarchiveTechRecord,
				promoteTechRecord,
				amendVrm,
				amendVin,
				generatePlate,
				generateLetter,
				generateADRCertificate,
				generateContingencyADRCertificate,
				fetchReferenceDataAudit,
				fetchReferenceDataByKey,
				fetchReferenceDataByKeySearch,
				fetchTyreReferenceDataByKeySearch
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
				fetchTestStationSuccess,
				fetchTestStationFailed,
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
				fetchDefectSuccess,
				fetchDefectFailed,
				getRequiredStandardsSuccess,
				getRequiredStandardsFailure,
				getRequiredStandardsComplete,
				fetchSearchResultSuccess,
				fetchSearchResultFailed,
				getRecallsSuccess,
				getRecallsFailure,
				fetchTestResultsSuccess,
				fetchTestResultsFailed,
				fetchTestResultsBySystemNumberSuccess,
				fetchTestResultsBySystemNumberFailed,
				fetchSelectedTestResultSuccess,
				fetchSelectedTestResultFailed,
				createTestResultSuccess,
				createTestResultFailed,
				updateTestResultSuccess,
				updateTestResultFailed,
				createVehicleRecordSuccess,
				createVehicleRecordFailure,
				getBySystemNumberSuccess,
				getBySystemNumberFailure,
				updateTechRecordSuccess,
				updateTechRecordFailure,
				archiveTechRecordSuccess,
				archiveTechRecordFailure,
				unarchiveTechRecordSuccess,
				unarchiveTechRecordFailure,
				promoteTechRecordSuccess,
				promoteTechRecordFailure,
				amendVrmSuccess,
				amendVrmFailure,
				amendVinSuccess,
				amendVinFailure,
				generatePlateSuccess,
				generatePlateFailure,
				generateLetterSuccess,
				generateLetterFailure,
				generateADRCertificateSuccess,
				generateADRCertificateFailure,
				fetchReferenceDataAuditSuccess,
				fetchReferenceDataAuditFailed,
				fetchReferenceDataByKeySuccess,
				fetchReferenceDataByKeyFailed,
				fetchReferenceDataByKeySearchSuccess,
				fetchReferenceDataByKeySearchFailed,
				fetchTyreReferenceDataByKeySearchSuccess,
				fetchTyreReferenceDataByKeySearchFailed
			),
			map(() => stopLoading())
		)
	);
}
