import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode } from '@forms/services/dynamic-form.types';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { TestStationType } from '@models/test-stations/test-station-type.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { selectQueryParam, selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { updateResultOfTest } from '@store/test-records';
import { getTestStationFromProperty } from '@store/test-stations';
import { selectTestType } from '@store/test-types/selectors/test-types.selectors';
import merge from 'lodash.merge';
import { catchError, concatMap, delay, filter, map, mergeMap, of, switchMap, take, withLatestFrom } from 'rxjs';
import {
	contingencyTestTypeSelected,
	createTestResult,
	createTestResultFailed,
	createTestResultSuccess,
	editingTestResult,
	fetchSelectedTestResult,
	fetchSelectedTestResultFailed,
	fetchSelectedTestResultSuccess,
	fetchTestResultsBySystemNumber,
	fetchTestResultsBySystemNumberFailed,
	fetchTestResultsBySystemNumberSuccess,
	templateSectionsChanged,
	testTypeIdChanged,
	updateTestResult,
	updateTestResultFailed,
	updateTestResultSuccess,
} from '../actions/test-records.actions';
import {
	isTestTypeOldIvaOrMsva,
	selectAllTestResultsInDateOrder,
	selectedTestResultState,
	testResultInEdit,
} from '../selectors/test-records.selectors';

@Injectable()
export class TestResultsEffects {
	private actions$ = inject(Actions);
	private testRecordsService = inject(TestRecordsService);
	private techRecordHttpService = inject(TechnicalRecordHttpService);
	private store = inject<Store<State>>(Store);
	private router = inject(Router);
	private userService = inject(UserService);
	private dfs = inject(DynamicFormService);
	private featureToggleService = inject(FeatureToggleService);

	fetchTestResultsBySystemNumber$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTestResultsBySystemNumber),
			mergeMap(({ systemNumber }) =>
				this.testRecordsService.fetchTestResultbySystemNumber(systemNumber, { fromDateTime: new Date(1970) }).pipe(
					map((testResults) => fetchTestResultsBySystemNumberSuccess({ payload: testResults })),
					catchError((e) => {
						switch (e.status) {
							case 404:
								return of(fetchTestResultsBySystemNumberSuccess({ payload: [] as TestResultModel[] }));
							default:
								return of(fetchTestResultsBySystemNumberFailed({ error: e.message }));
						}
					})
				)
			)
		)
	);

	fetchSelectedTestResult$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchSelectedTestResult),
			mergeMap(() => this.store.pipe(select(selectRouteNestedParams), take(1))),
			mergeMap((params) => {
				const { systemNumber, testResultId } = params;
				return this.testRecordsService
					.fetchTestResultbySystemNumber(systemNumber, { fromDateTime: new Date(1970), testResultId, version: 'all' })
					.pipe(
						map((vehicleTestRecords) => {
							if (vehicleTestRecords && vehicleTestRecords.length === 1) {
								return fetchSelectedTestResultSuccess({ payload: vehicleTestRecords[0] });
							}
							return fetchSelectedTestResultFailed({ error: 'Test result not found' });
						}),
						catchError((e) => {
							return of(fetchSelectedTestResultFailed({ error: e.message }));
						})
					);
			})
		)
	);

	/**
	 * Call POST Test Results API to update test result
	 */
	createTestResult$ = createEffect(() =>
		this.actions$.pipe(
			ofType(createTestResult),
			switchMap((action) => {
				const testResult = action.value;
				return this.testRecordsService.postTestResult(testResult).pipe(
					take(1),
					map(() => createTestResultSuccess({ payload: { id: testResult.testResultId, changes: testResult } })),
					catchError((e) => {
						const validationsErrors: GlobalError[] = [];
						if (e.status === 400) {
							const {
								error: { errors },
							} = e;
							// eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-unused-expressions
							Array.isArray(errors)
								? errors.forEach((error: string) => {
										const field = error.match(/"([^"]+)"/);
										validationsErrors.push({
											error,
											anchorLink: field && field.length > 1 ? field[1].replace('"', '') : '',
										});
									})
								: validationsErrors.push({ error: e.error });
						} else if (e.status === 502) {
							validationsErrors.push({
								error: 'Internal Server Error, please contact technical support',
								anchorLink: '',
							});
						}
						return of(createTestResultFailed({ errors: validationsErrors }));
					})
				);
			})
		)
	);

	/**
	 * Call PUT Test Results API to update test result
	 */
	updateTestResult$ = createEffect(() =>
		this.actions$.pipe(
			ofType(updateTestResult),
			mergeMap((action) =>
				of(action.value).pipe(
					withLatestFrom(
						this.userService.name$,
						this.userService.id$,
						this.userService.userEmail$,
						this.store.select(selectRouteNestedParams),
						this.store.select(selectAllTestResultsInDateOrder)
					),
					take(1)
				)
			),
			mergeMap(([testResult, name, id, userEmail, { systemNumber }, testResults]) => {
				return this.testRecordsService
					.saveTestResult(
						systemNumber,
						{ name, id, userEmail },
						this.testRecordsService.prepareTestResultForAmendment(testResults, testResult)
					)
					.pipe(
						take(1),
						map((responseBody) =>
							updateTestResultSuccess({ payload: { id: responseBody.testResultId, changes: responseBody } })
						),
						catchError((e) => {
							const validationsErrors: GlobalError[] = [];
							if (e.status === 400) {
								const {
									error: { errors },
								} = e;
								errors.forEach((error: string) => {
									const field = error.match(/"([^"]+)"/);
									validationsErrors.push({
										error,
										anchorLink: field && field.length > 1 ? field[1].replace('"', '') : '',
									});
								});
							} else if (e.status === 502) {
								validationsErrors.push({
									error: 'Internal Server Error, please contact technical support',
									anchorLink: '',
								});
							}
							return of(updateTestResultFailed({ errors: validationsErrors }));
						})
					);
			})
		)
	);

	generateSectionTemplatesAndtestResultToUpdate$ = createEffect(() =>
		this.actions$.pipe(
			ofType(editingTestResult, testTypeIdChanged),
			mergeMap((action) =>
				of(action).pipe(
					withLatestFrom(
						this.store.pipe(select(selectedTestResultState)),
						this.store.pipe(select(selectQueryParam('edit'))),
						this.store.pipe(select(isTestTypeOldIvaOrMsva))
					),
					take(1)
				)
			),
			concatMap(([action, selectedTestResult, isEditing, isOldIVAorMSVAtest]) => {
				const { testTypeId } = action;

				const { vehicleType } = selectedTestResult ?? {};

				if (!vehicleType || !Object.prototype.hasOwnProperty.call(masterTpl, vehicleType)) {
					return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
				}

				const testTypeGroup = TestRecordsService.getTestTypeGroup(testTypeId);

				// tech-debt: feature flag check to be removed when required standard is enabled
				const isRequiredStandardsEnabled = this.featureToggleService.isFeatureEnabled('requiredStandards');

				const isIVAorMSVATest =
					testTypeGroup === 'testTypesSpecialistGroup1' || testTypeGroup === 'testTypesSpecialistGroup5';

				const vehicleTpl = masterTpl[`${vehicleType}`];

				const testTypeGroupString =
					(!isRequiredStandardsEnabled || isOldIVAorMSVAtest) && isIVAorMSVATest
						? `${testTypeGroup}OldIVAorMSVA`
						: testTypeGroup;

				let tpl: Record<string, FormNode> | undefined;

				if (testTypeGroupString && Object.prototype.hasOwnProperty.call(vehicleTpl, testTypeGroupString)) {
					tpl = vehicleTpl[testTypeGroupString as keyof typeof TEST_TYPES];
				} else if (isEditing === 'true') {
					tpl = undefined;
				} else {
					tpl = vehicleTpl.default;
				}

				if (!tpl) {
					return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
				}

				const mergedForms = {};

				for (const node of Object.values(tpl)) {
					const form = this.dfs.createForm(node, selectedTestResult);
					merge(mergedForms, form.getCleanValue(form));
				}

				if (testTypeId) {
					(mergedForms as TestResultModel).testTypes[0].testTypeId = testTypeId;
				}

				return of(
					templateSectionsChanged({
						sectionTemplates: Object.values(tpl),
						sectionsValue: mergedForms as TestResultModel,
					}),
					updateResultOfTest()
				);
			})
		)
	);

	generateContingencyTestTemplatesAndtestResultToUpdate$ = createEffect(() =>
		this.actions$.pipe(
			ofType(contingencyTestTypeSelected),
			mergeMap((action) =>
				of(action).pipe(
					withLatestFrom(
						this.store.select(testResultInEdit),
						this.store.select(selectTestType(action.testType)),
						this.store.select(getTestStationFromProperty('testStationType', TestStationType.HQ)),
						this.userService.user$
					),
					take(1)
				)
			),
			concatMap(([action, editedTestResult, testTypeTaxonomy, testStation, user]) => {
				const id = action.testType;

				const vehicleType = editedTestResult?.vehicleType;
				if (!vehicleType || !Object.prototype.hasOwnProperty.call(contingencyTestTemplates, vehicleType)) {
					return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
				}

				const testTypeGroup = TestRecordsService.getTestTypeGroup(id);
				// tech-debt: feature flag check to be removed when required standard is enabled
				const isRequiredStandardsEnabled = this.featureToggleService.isFeatureEnabled('requiredStandards');
				const isIVAorMSVATest =
					testTypeGroup === 'testTypesSpecialistGroup1' || testTypeGroup === 'testTypesSpecialistGroup5';

				const vehicleTpl = contingencyTestTemplates[`${vehicleType}`];
				const testTypeGroupString =
					!isRequiredStandardsEnabled && isIVAorMSVATest ? `${testTypeGroup}OldIVAorMSVA` : testTypeGroup;

				const tpl =
					testTypeGroupString && Object.prototype.hasOwnProperty.call(vehicleTpl, testTypeGroupString)
						? vehicleTpl[testTypeGroupString as keyof typeof TEST_TYPES]
						: vehicleTpl.default;

				const mergedForms = {} as TestResultModel;

				for (const node of Object.values(tpl || {})) {
					const form = this.dfs.createForm(node, editedTestResult);
					merge(mergedForms, form.getCleanValue(form));
				}

				mergedForms.testTypes[0].testTypeId = id;
				mergedForms.testTypes[0].name = testTypeTaxonomy?.name ?? '';
				mergedForms.testTypes[0].testTypeName = testTypeTaxonomy?.testTypeName ?? '';
				mergedForms.typeOfTest = (testTypeTaxonomy?.typeOfTest as TypeOfTest) ?? TypeOfTest.CONTINGENCY;

				const now = new Date().toISOString();

				if (mergedForms.typeOfTest !== TypeOfTest.CONTINGENCY) {
					mergedForms.testerName = user.name;
					mergedForms.testerEmailAddress = user.userEmail;
					mergedForms.testerStaffId = user.oid;
					mergedForms.testStartTimestamp = now;
					mergedForms.testEndTimestamp = now;
					mergedForms.testTypes[0].testTypeStartTimestamp = now;
					mergedForms.testTypes[0].testTypeEndTimestamp = now;
					mergedForms.testStationName = testStation?.testStationName ?? '[INVALID_OPTION]';
					mergedForms.testStationPNumber = testStation?.testStationPNumber ?? '[INVALID_OPTION]';
					mergedForms.testStationType = TestStationType.ATF;
				}

				return of(templateSectionsChanged({ sectionTemplates: Object.values(tpl || {}), sectionsValue: mergedForms }));
			})
		)
	);

	createTestResultSuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(createTestResultSuccess),
				delay(3000),
				map((action) => action.payload.changes.systemNumber as string),
				switchMap((systemNumber) => this.techRecordHttpService.getBySystemNumber$(systemNumber)),
				map((results) => results.find((result) => result.techRecord_statusCode === StatusCodes.CURRENT)),
				filter(Boolean),
				switchMap((techRecord) =>
					this.router.navigate(['tech-records', techRecord.systemNumber, techRecord.createdTimestamp])
				)
			),
		{ dispatch: false }
	);
}
