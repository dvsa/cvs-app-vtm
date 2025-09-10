import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { mockTestResult, mockTestResultList } from '@mocks/mock-test-result';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { OdometerReadingUnits } from '@models/test-types/odometer-unit.enum';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { FormNode, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { HttpService } from '@services/http/http.service';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { selectQueryParams, selectRouteNestedParams } from '@store/router/router.selectors';
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
	getRecalls,
	getRecallsFailure,
	getRecallsSuccess,
	isTestTypeOldIvaOrMsva,
	selectedTestResultState,
	templateSectionsChanged,
	testResultInEdit,
	testTypeIdChanged,
	updateResultOfTest,
	updateTestResult,
	updateTestResultFailed,
	updateTestResultSuccess,
} from '@store/test-records';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TestResultsEffects } from '../test-records.effects';

jest.mock('@forms/templates/test-records/master.template', () => ({
	__esModule: true,
	default: jest.fn(),
	masterTpl: {
		psv: {
			default: {
				test: <FormNode>{
					name: 'Default',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'testTypes',
							type: FormNodeTypes.ARRAY,
							children: [
								{
									name: '0',
									type: FormNodeTypes.GROUP,
									children: [{ name: 'testTypeId', type: FormNodeTypes.CONTROL, value: '' }],
								},
							],
						},
					],
				},
			},
			testTypesGroup1: {
				test: <FormNode>{
					name: 'Test',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'testTypes',
							type: FormNodeTypes.ARRAY,
							children: [
								{
									name: '0',
									type: FormNodeTypes.GROUP,
									children: [{ name: 'testTypeId', type: FormNodeTypes.CONTROL, value: '' }],
								},
							],
						},
					],
				},
			},
			testTypesSpecialistGroup1: {
				test: <FormNode>{
					name: 'NewSpecialistTest',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'testTypes',
							type: FormNodeTypes.ARRAY,
							children: [
								{
									name: '0',
									type: FormNodeTypes.GROUP,
									children: [{ name: 'testTypeId', type: FormNodeTypes.CONTROL, value: '' }],
								},
							],
						},
					],
				},
			},
			testTypesSpecialistGroup1OldIVAorMSVA: {
				test: <FormNode>{
					name: 'OldSpecialistTest',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'testTypes',
							type: FormNodeTypes.ARRAY,
							children: [
								{
									name: '0',
									type: FormNodeTypes.GROUP,
									children: [{ name: 'testTypeId', type: FormNodeTypes.CONTROL, value: '' }],
								},
							],
						},
					],
				},
			},
		},
	},
}));
// This must be imported here to avoid the test suite failing -
// https://stackoverflow.com/questions/65554910/jest-referenceerror-cannot-access-before-initialization/67114668#67114668
import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { techRecord } from '../../technical-records';

describe('TestResultsEffects', () => {
	let effects: TestResultsEffects;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let testResultsService: TestRecordsService;
	let store: MockStore<State>;
	let featureToggleService: FeatureToggleService;
	let httpService: HttpService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				TestResultsEffects,
				provideMockActions(() => actions$),
				TestRecordsService,
				provideMockStore({
					initialState: initialAppState,
					selectors: [
						{
							selector: selectRouteNestedParams,
							value: [
								{
									systemNumber: 'systemNumber01',
									testResultId: 'testResult01',
								},
							],
						},
					],
				}),
				{
					provide: UserService,
					useValue: {
						user$: of({ name: 'testername', userEmail: 'test@test.com', oid: '123zxc' }),
						name$: of('name'),
						userEmail$: of('userEmail'),
						id$: of('iod'),
					},
				},
				RouterService,
				DynamicFormService,
				FeatureToggleService,
				{
					provide: HttpService,
					useValue: {
						getRecalls: jest.fn(),
						getTestTypesid: jest.fn().mockReturnValue(of(createMockTestType())),
					},
				},
			],
		});

		store = TestBed.inject(MockStore);
		effects = TestBed.inject(TestResultsEffects);
		testResultsService = TestBed.inject(TestRecordsService);
		featureToggleService = TestBed.inject(FeatureToggleService);
		httpService = TestBed.inject(HttpService);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	describe('fetchTestResultsBySystemNumber$', () => {
		it('should return fetchTestResultBySystemNumberSuccess action on successfull API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const testResults = mockTestResultList();

				// mock action to trigger effect
				actions$ = hot('-a--', { a: fetchTestResultsBySystemNumber });

				// mock service call
				jest
					.spyOn(testResultsService, 'fetchTestResultbySystemNumber')
					.mockReturnValue(cold('--a|', { a: testResults }));

				// expect effect to return success action
				expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
					b: fetchTestResultsBySystemNumberSuccess({ payload: testResults }),
				});
			});
		});

		it('should return fetchTestResultsBySystemNumberFailed action on API error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: fetchTestResultsBySystemNumber });

				const expectedError = new HttpErrorResponse({
					status: 500,
					statusText: 'Internal server error',
				});
				jest
					.spyOn(testResultsService, 'fetchTestResultbySystemNumber')
					.mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
					b: fetchTestResultsBySystemNumberFailed({
						error: 'Http failure response for (unknown url): 500 Internal server error',
					}),
				});
			});
		});

		it('should return fetchTestResultsBySystemNumberSuccess on a 404', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: fetchTestResultsBySystemNumber });

				const expectedError = new HttpErrorResponse({
					status: 404,
					statusText: 'Not found',
				});
				jest
					.spyOn(testResultsService, 'fetchTestResultbySystemNumber')
					.mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
					b: fetchTestResultsBySystemNumberSuccess({ payload: [] as TestResultModel[] }),
				});
			});
		});
	});

	describe('fetchSelectedTestResult$', () => {
		it('should return fetchSelectedTestResultSuccess', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const testResult = mockTestResult();

				actions$ = hot('-a-', { a: fetchSelectedTestResult() });

				jest
					.spyOn(testResultsService, 'fetchTestResultbySystemNumber')
					.mockReturnValue(cold('--a|', { a: [testResult] }));

				expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
					b: fetchSelectedTestResultSuccess({ payload: testResult }),
				});
			});
		});

		it('should return fetchSelectedTestResultFailed if API returns empty array', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a-', { a: fetchSelectedTestResult() });

				jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--a|', { a: [] }));

				expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
					b: fetchSelectedTestResultFailed({ error: 'Test result not found' }),
				});
			});
		});

		it('should return fetchSelectedTestResultFailed if API returns an error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a-', { a: fetchSelectedTestResult() });

				// mock service call
				const expectedError = new HttpErrorResponse({
					status: 400,
					statusText: 'Bad Request',
				});
				jest
					.spyOn(testResultsService, 'fetchTestResultbySystemNumber')
					.mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
					b: fetchSelectedTestResultFailed({ error: 'Http failure response for (unknown url): 400 Bad Request' }),
				});
			});
		});
	});

	describe('updateTestResult$', () => {
		const newTestResult = { testResultId: '1', testTypes: [{ testTypeId: '1' }] } as TestResultModel;

		it('should dispatch updateTestResultSuccess with return payload', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a-', { a: updateTestResult({ value: newTestResult }) });

				jest.spyOn(testResultsService, 'saveTestResult').mockReturnValue(cold('---b', { b: newTestResult }));

				expectObservable(effects.updateTestResult$).toBe('----b', {
					b: updateTestResultSuccess({ payload: { id: '1', changes: newTestResult } }),
				});
			});
		});

		it('should dispatch updateTestResultFailed action with empty errors array', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a-', { a: updateTestResult({ value: newTestResult }) });

				jest
					.spyOn(testResultsService, 'saveTestResult')
					.mockReturnValue(cold('---#|', {}, new HttpErrorResponse({ status: 500, error: 'some error' })));

				expectObservable(effects.updateTestResult$).toBe('----b', {
					b: updateTestResultFailed({ errors: [] }),
				});
			});
		});

		it('should dispatch updateTestResultFailed action with validation errors', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a-', { a: updateTestResult({ value: newTestResult }) });

				jest.spyOn(testResultsService, 'saveTestResult').mockReturnValue(
					cold(
						'---#|',
						{},
						new HttpErrorResponse({
							status: 400,
							error: { errors: ['"name" is missing', '"age" is missing', 'random error'] },
						})
					)
				);

				const expectedErrors: GlobalError[] = [
					{ error: '"name" is missing', anchorLink: 'name' },
					{ error: '"age" is missing', anchorLink: 'age' },
					{ error: 'random error', anchorLink: '' },
				];
				expectObservable(effects.updateTestResult$).toBe('----b', {
					b: updateTestResultFailed({ errors: expectedErrors }),
				});
			});
		});
	});

	describe('generateSectionTemplatesAndtestResultToUpdate$', () => {
		beforeEach(() => {
			store.resetSelectors();
			jest.resetModules();
		});
		it('should automatically set the euVehicleCategory to M1 if vehicleType is Car', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.CAR,
				testTypes: [createMockTestType({ testTypeId: '1' })],
			});
			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(testResultInEdit, testResult);

				actions$ = hot('-a', {
					a: contingencyTestTypeSelected({
						testType: '1',
					}),
				});

				expectObservable(effects.generateContingencyTestTemplatesAndtestResultToUpdate$).toBe('-b', {
					b: templateSectionsChanged({
						sectionTemplates: Object.values(contingencyTestTemplates.car.default as Record<string, FormNode>),
						sectionsValue: {
							bodyType: undefined,
							countryOfRegistration: '',
							createdAt: '',
							createdById: undefined,
							createdByName: undefined,
							euVehicleCategory: 'm1',
							firstUseDate: null,
							lastUpdatedAt: undefined,
							lastUpdatedById: undefined,
							lastUpdatedByName: undefined,
							make: undefined,
							model: undefined,
							noOfAxles: undefined,
							numberOfWheelsDriven: undefined,
							odometerReading: 0,
							odometerReadingUnits: 'kilometres',
							preparerId: '',
							preparerName: '',
							reasonForCancellation: undefined,
							reasonForCreation: undefined,
							recalls: undefined,
							regnDate: undefined,
							shouldEmailCertificate: undefined,
							source: undefined,
							systemNumber: '',
							testResultId: '',
							testStartTimestamp: '',
							testStationName: '',
							testStationPNumber: '',
							testStationType: 'atf',
							testStatus: undefined,
							testTypes: [
								{
									additionalCommentsForAbandon: null,
									additionalNotesRecorded: '',
									certificateLink: undefined,
									certificateNumber: '',
									defects: [],
									deletionFlag: undefined,
									name: '',
									prohibitionIssued: false,
									reasonForAbandoning: '',
									secondaryCertificateNumber: null,
									testAnniversaryDate: 'testAnniversaryDate',
									testCode: 'testCode',
									testExpiryDate: '',
									testNumber: 'testNumber',
									testResult: 'fail',
									testTypeEndTimestamp: '',
									testTypeId: '1',
									testTypeName: '',
									testTypeStartTimestamp: '',
								},
							],
							testerEmailAddress: '',
							testerName: '',
							testerStaffId: '',
							typeOfTest: 'contingency',
							vehicleClass: null,
							vehicleConfiguration: null,
							vehicleSize: undefined,
							vehicleSubclass: [],
							vehicleType: 'car',
							vin: '',
							vrm: '',
						} as unknown as TestResultModel,
					}),
				});
			});
		});

		it('should dispatch templateSectionsChanged with new sections and test result', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.PSV,
				testTypes: [createMockTestType({ testTypeId: '1' })],
			});

			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectedTestResultState, testResult);

				actions$ = hot('-a', {
					a: editingTestResult({
						testTypeId: '1',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-(bc)', {
					b: templateSectionsChanged({
						sectionTemplates: Object.values(masterTpl.psv['testTypesGroup1'] as Record<string, FormNode>),
						sectionsValue: { testTypes: [{ testTypeId: '1' }] } as unknown as TestResultModel,
					}),
					c: updateResultOfTest(),
				});
			});
		});
		it('should dispatch templateSectionsChanged with new sections when custom defects is not present', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.PSV,
				testTypes: [createMockTestType({ testTypeId: '126' })],
			});
			jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(true);
			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectQueryParams, { edit: 'true' });
				store.overrideSelector(selectedTestResultState, testResult);
				store.overrideSelector(isTestTypeOldIvaOrMsva, false);

				actions$ = hot('-a', {
					a: editingTestResult({
						testTypeId: '126',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-(bc)', {
					b: templateSectionsChanged({
						sectionTemplates: Object.values(masterTpl.psv['testTypesSpecialistGroup1'] as Record<string, FormNode>),
						sectionsValue: { testTypes: [{ testTypeId: '126' }] } as unknown as TestResultModel,
					}),
					c: updateResultOfTest(),
				});
			});
		});
		it('should dispatch templateSectionsChanged with old sections when custom defects is present', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.PSV,
				testTypes: [createMockTestType({ testTypeId: '126' })],
			});
			jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(true);
			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectQueryParams, { edit: 'true' });
				store.overrideSelector(selectedTestResultState, testResult);
				store.overrideSelector(isTestTypeOldIvaOrMsva, true);

				actions$ = hot('-a', {
					a: editingTestResult({
						testTypeId: '126',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-(bc)', {
					b: templateSectionsChanged({
						sectionTemplates: Object.values(
							masterTpl.psv['testTypesSpecialistGroup1OldIVAorMSVA'] as Record<string, FormNode>
						),
						sectionsValue: { testTypes: [{ testTypeId: '126' }] } as unknown as TestResultModel,
					}),
					c: updateResultOfTest(),
				});
			});
		});
		it('should return empty section templates if action testResult.vehicleType === undefined', () => {
			const testResult = createMockTestResult({
				vehicleType: undefined,
				testTypes: [createMockTestType({ testTypeId: '1' })],
			});

			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectedTestResultState, testResult);
				actions$ = hot('-a', {
					a: testTypeIdChanged({
						testTypeId: '1',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
					b: templateSectionsChanged({
						sectionTemplates: [],
						sectionsValue: undefined,
					}),
				});
			});
		});

		it('should return empty section templates if action testResult.vehicleType is not known by masterTpl', () => {
			const testResult = createMockTestResult({
				vehicleType: 'car' as VehicleTypes,
				testTypes: [createMockTestType({ testTypeId: '1' })],
			});

			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectedTestResultState, testResult);

				actions$ = hot('-a', {
					a: testTypeIdChanged({
						testTypeId: '1',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
					b: templateSectionsChanged({
						sectionTemplates: [],
						sectionsValue: undefined,
					}),
				});
			});
		});

		it('should return empty section templates if testTypeId doesnt apply to vehicleType', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.PSV,
				testTypes: [createMockTestType({ testTypeId: '190' })],
			});

			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectQueryParams, { edit: 'true' });
				store.overrideSelector(selectedTestResultState, testResult);

				actions$ = hot('-a', {
					a: testTypeIdChanged({
						testTypeId: '190',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
					b: templateSectionsChanged({
						sectionTemplates: [],
						sectionsValue: undefined,
					}),
				});
			});
		});

		it('should return empty section templates if testTypeId is known but not in master template and edit is true', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.PSV,
				testTypes: [createMockTestType({ testTypeId: '39' })],
			});

			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectQueryParams, { edit: 'true' });
				store.overrideSelector(selectedTestResultState, testResult);

				actions$ = hot('-a', {
					a: testTypeIdChanged({
						testTypeId: '39',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
					b: templateSectionsChanged({
						sectionTemplates: [],
						sectionsValue: undefined,
					}),
				});
			});
		});

		it('should return default section templates if testTypeId is known but not in master template and edit is false', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.PSV,
				testTypes: [createMockTestType({ testTypeId: '39' })],
			});
			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(selectQueryParams, { edit: 'false' });
				store.overrideSelector(selectedTestResultState, testResult);

				actions$ = hot('-a', {
					a: testTypeIdChanged({
						testTypeId: '39',
					}),
				});

				expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-(bc)', {
					b: templateSectionsChanged({
						sectionTemplates: Object.values(masterTpl.psv['default'] as Record<string, FormNode>),
						sectionsValue: { testTypes: [{ testTypeId: '39' }] } as unknown as TestResultModel,
					}),
					c: updateResultOfTest(),
				});
			});
		});
	});

	describe('generateContingencyTestTemplatesAndtestResultToUpdate$', () => {
		beforeEach(() => {
			store.resetSelectors();
			jest.resetModules();
		});

		it('should dispatch templateSectionsChanged with new sections and test result', () => {
			const testResult = createMockTestResult({
				vehicleType: VehicleTypes.PSV,
				testTypes: [createMockTestType({ testTypeId: '1' })],
			});

			store.overrideSelector(testResultInEdit, testResult);

			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', {
					a: contingencyTestTypeSelected({
						testType: '1',
					}),
				});

				expectObservable(effects.generateContingencyTestTemplatesAndtestResultToUpdate$).toBe('-b', {
					b: templateSectionsChanged({
						sectionTemplates: Object.values(
							contingencyTestTemplates.psv['testTypesGroup1'] as Record<string, FormNode>
						),
						sectionsValue: {
							bodyType: undefined,
							contingencyTestNumber: undefined,
							countryOfRegistration: '',
							createdById: undefined,
							createdByName: undefined,
							euVehicleCategory: EUVehicleCategory.M1,
							firstUseDate: null,
							lastUpdatedAt: undefined,
							lastUpdatedById: undefined,
							lastUpdatedByName: undefined,
							make: undefined,
							model: undefined,
							noOfAxles: undefined,
							numberOfSeats: undefined,
							numberOfWheelsDriven: undefined,
							odometerReading: 0,
							odometerReadingUnits: OdometerReadingUnits.KILOMETRES,
							preparerId: '',
							preparerName: '',
							reasonForCancellation: undefined,
							reasonForCreation: undefined,
							regnDate: undefined,
							source: undefined,
							shouldEmailCertificate: undefined,
							systemNumber: '',
							testEndTimestamp: '',
							testResultId: '',
							testStartTimestamp: '',
							testStationName: '',
							testStationPNumber: '',
							testStationType: 'atf',
							testStatus: undefined,
							testTypes: [
								{
									additionalCommentsForAbandon: null,
									additionalNotesRecorded: '',
									certificateLink: undefined,
									certificateNumber: '',
									customDefects: [],
									defects: [],
									deletionFlag: undefined,
									lastSeatbeltInstallationCheckDate: '',
									name: '',
									numberOfSeatbeltsFitted: 0,
									prohibitionIssued: false,
									reasonForAbandoning: '',
									seatbeltInstallationCheckDate: false,
									secondaryCertificateNumber: null,
									testExpiryDate: '',
									testResult: resultOfTestEnum.fail,
									testTypeEndTimestamp: '',
									testTypeId: '1',
									testTypeName: '',
									testTypeStartTimestamp: '',
								},
							],
							testerEmailAddress: '',
							testerName: '',
							testerStaffId: '',
							typeOfTest: TypeOfTest.CONTINGENCY,
							vehicleClass: null,
							vehicleConfiguration: undefined,
							vehicleSize: undefined,
							vehicleType: 'psv',
							vin: '',
							vrm: '',
						} as unknown as TestResultModel,
					}),
				});
			});
		});
	});

	describe('createTestResult$$', () => {
		it('should return createTestResultSuccess action on successfull API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const testResult: TestResultModel = mockTestResult();
				// mock action to trigger effect
				actions$ = hot('-a--', { a: createTestResult({ value: testResult }) });
				// mock service call
				jest
					.spyOn(testResultsService, 'postTestResult')
					.mockReturnValue(cold('---b|', { b: testResult }) as unknown as Observable<HttpResponse<unknown>>);

				// expect effect to return success action
				expectObservable(effects.createTestResult$).toBe('----b', {
					b: createTestResultSuccess({ payload: { id: testResult.testResultId, changes: testResult } }),
				});
			});
		});

		it('should return createTestResultFailed', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const testResult: TestResultModel = mockTestResult();
				actions$ = hot('-a--', { a: createTestResult({ value: testResult }) });

				const expectedError = new HttpErrorResponse({
					status: 500,
					statusText: 'Internal server error',
				});

				jest.spyOn(testResultsService, 'postTestResult').mockReturnValue(cold('---#|', {}, expectedError));

				expectObservable(effects.createTestResult$).toBe('----b', {
					b: createTestResultFailed({ errors: [] }),
				});
			});
		});

		it('should return createTestResultFailed and add validation errors', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const testResult: TestResultModel = mockTestResult();
				actions$ = hot('-a--', { a: createTestResult({ value: testResult }) });

				const expectedError = new HttpErrorResponse({
					status: 400,
					error: { errors: ['"name" is missing', '"age" is missing', 'random error'] },
				});

				jest.spyOn(testResultsService, 'postTestResult').mockReturnValue(cold('---#|', {}, expectedError));

				const expectedErrors: GlobalError[] = [
					{ error: '"name" is missing', anchorLink: 'name' },
					{ error: '"age" is missing', anchorLink: 'age' },
					{ error: 'random error', anchorLink: '' },
				];

				expectObservable(effects.createTestResult$).toBe('----b', {
					b: createTestResultFailed({ errors: expectedErrors }),
				});
			});
		});

		it('should return createTestResultFailed and add a validation error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const testResult: TestResultModel = mockTestResult();
				actions$ = hot('-a--', { a: createTestResult({ value: testResult }) });

				const expectedError = new HttpErrorResponse({
					status: 400,
					error: 'Certificate number not present on TIR test type',
				});

				jest.spyOn(testResultsService, 'postTestResult').mockReturnValue(cold('---#|', {}, expectedError));

				const expectedErrors: GlobalError[] = [{ error: 'Certificate number not present on TIR test type' }];

				expectObservable(effects.createTestResult$).toBe('----b', {
					b: createTestResultFailed({ errors: expectedErrors }),
				});
			});
		});
	});

	describe('getRecalls$', () => {
		it('should return getRecallsSuccess action on a successful API call', () => {
			const recalls: RecallsSchema = { hasRecall: true, manufacturer: 'Ford' };

			store.overrideSelector(techRecord, createMockHgv(1234) as TechRecordType<'get'>);

			testScheduler.run(({ hot, cold, expectObservable }) => {
				// mock action to trigger effect
				actions$ = hot('-a--', { a: getRecalls() });

				// mock service call
				jest.spyOn(httpService, 'getRecalls').mockReturnValue(cold('--a|', { a: recalls }));

				// expect effect to return success action
				expectObservable(effects.onGetRecalls$).toBe('---b', {
					b: getRecallsSuccess({ recalls }),
				});
			});
		});

		it('should return getRecallsFailed action on API error', () => {
			store.overrideSelector(techRecord, createMockHgv(1234) as TechRecordType<'get'>);

			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: getRecalls() });

				const expectedError = new Error('Bad Gateway');

				jest.spyOn(httpService, 'getRecalls').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.onGetRecalls$).toBe('---b', {
					b: getRecallsFailure({ error: 'Bad Gateway' }),
				});
			});
		});
	});
});
