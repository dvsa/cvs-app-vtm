import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { createMockCustomDefect } from '@mocks/custom-defect.mock';
import { mockTestResult } from '@mocks/mock-test-result';
import { operatorEnum } from '@models/condition.model';
import { TRL_EU_VEHICLE_CATEGORY_OPTIONS } from '@models/options.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State, initialAppState } from '@store/index';
import { selectRouteData } from '@store/router/router.selectors';
import { editingTechRecord, selectTechRecord, techRecord } from '@store/technical-records';
import { testResultInEdit } from '@store/test-records';
import { initialTestStationsState } from '@store/test-stations';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { CustomAsyncValidators } from '../custom-async-validators';

describe('resultDependantOnCustomDefects', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), RouterService],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			testResult: new CustomFormControl({ name: 'testResult', type: FormNodeTypes.CONTROL, children: [] }, null),
		});
	});

	it('should fail validation when value is "pass" and defects are present', async () => {
		form.controls['testResult'].patchValue('pass');

		const mockedTestResult = mockTestResult();
		mockedTestResult.testTypes[0].customDefects = [createMockCustomDefect()];
		store.overrideSelector(testResultInEdit, mockedTestResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.resultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ invalidTestResult: { message: 'Cannot pass test when defects are present' } });
	});

	it('should fail validation when value is "fail" but no defects are present', async () => {
		form.controls['testResult'].patchValue('fail');

		const testResult = mockTestResult();
		testResult.testTypes = [];

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.resultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ invalidTestResult: { message: 'Cannot fail test when no defects are present' } });
	});

	it('should fail validation when value is "prs" but no defects are present', async () => {
		form.controls['testResult'].patchValue('prs');

		const testResult = mockTestResult();
		testResult.testTypes = [];

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.resultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ invalidTestResult: { message: 'Cannot mark test as PRS when no defects are present' } });
	});

	it('should pass validation when value is "abandoned"', async () => {
		form.controls['testResult'].patchValue('abandoned');

		store.overrideSelector(testResultInEdit, mockTestResult());

		const result = await firstValueFrom(
			CustomAsyncValidators.resultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});
});

describe('filterEuCategoryOnVehicleType', () => {
	let form: FormGroup;
	let store: MockStore<State>;
	let techRecordService: TechnicalRecordService;
	let routerService: RouterService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), TechnicalRecordService, RouterService],
			imports: [HttpClientTestingModule, RouterTestingModule],
		});

		store = TestBed.inject(MockStore);
		techRecordService = TestBed.inject(TechnicalRecordService);
		routerService = TestBed.inject(RouterService);

		form = new FormGroup({
			euVehicleCategory: new CustomFormControl(
				{ name: 'euVehicleCategory', type: FormNodeTypes.CONTROL, children: [] },
				null
			),
		});
	});
	it('should not disable the control if it is amend mode and the vehicle type is car', async () => {
		const carTechRecord: TechRecordType<'car', 'get'> = {
			primaryVrm: '',
			techRecord_vehicleSubclass: undefined,
			createdTimestamp: '',
			systemNumber: '',
			techRecord_createdAt: '',
			techRecord_createdById: '',
			techRecord_createdByName: '',
			techRecord_euVehicleCategory: undefined,
			techRecord_notes: '',
			techRecord_vehicleConfiguration: undefined,
			techRecord_vehicleType: 'car',
			partialVin: '',
			techRecord_noOfAxles: 2,
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
			vin: '',
		};

		const control = form.controls['euVehicleCategory'] as CustomFormControl;
		store.overrideSelector(techRecord, carTechRecord);
		store.overrideSelector(selectTechRecord, carTechRecord);
		const routeData = { mode: 'amend' };
		store.overrideSelector(selectRouteData, routeData);
		await firstValueFrom(
			CustomAsyncValidators.filterEuCategoryOnVehicleType(
				techRecordService,
				routerService
			)(control) as Observable<ValidationErrors | null>
		);
		expect(control.disabled).toEqual(false);
	});
	it('should disable the control if it is create mode and vehicle type is car', async () => {
		const carTechRecord: TechRecordType<'car', 'get'> = {
			primaryVrm: '',
			techRecord_vehicleSubclass: undefined,
			createdTimestamp: '',
			systemNumber: '',
			techRecord_createdAt: '',
			techRecord_createdById: '',
			techRecord_createdByName: '',
			techRecord_euVehicleCategory: undefined,
			techRecord_notes: '',
			techRecord_vehicleConfiguration: undefined,
			techRecord_vehicleType: 'car',
			partialVin: '',
			techRecord_noOfAxles: 2,
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
			vin: '',
		};

		const control = form.controls['euVehicleCategory'] as CustomFormControl;
		store.overrideSelector(techRecord, carTechRecord);
		store.overrideSelector(selectTechRecord, carTechRecord);
		const routeData = { mode: 'create' };
		store.overrideSelector(selectRouteData, routeData);
		await firstValueFrom(
			CustomAsyncValidators.filterEuCategoryOnVehicleType(
				techRecordService,
				routerService
			)(control) as Observable<ValidationErrors | null>
		);
		expect(control.disabled).toEqual(true);
	});
	it('should disable the control if it is create mode and vehicle type is lgv', async () => {
		const lgvTechRecord: TechRecordType<'lgv', 'get'> = {
			createdTimestamp: '',
			systemNumber: '',
			techRecord_createdAt: '',
			techRecord_createdById: '',
			techRecord_createdByName: '',
			techRecord_euVehicleCategory: undefined,
			techRecord_notes: '',
			techRecord_vehicleConfiguration: undefined,
			techRecord_vehicleType: 'lgv',
			partialVin: '',
			techRecord_noOfAxles: 2,
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
			vin: '',
			techRecord_adrDetails_dangerousGoods: true,
		};

		const control = form.controls['euVehicleCategory'] as CustomFormControl;
		store.overrideSelector(techRecord, lgvTechRecord);
		store.overrideSelector(selectTechRecord, lgvTechRecord);
		const routeData = { mode: 'create' };
		store.overrideSelector(selectRouteData, routeData);
		await firstValueFrom(
			CustomAsyncValidators.filterEuCategoryOnVehicleType(
				techRecordService,
				routerService
			)(control) as Observable<ValidationErrors | null>
		);
		expect(control.disabled).toEqual(true);
	});
	it('should set control options to trl eu category list if vehicle type is trl', async () => {
		const trlTechRecord: TechRecordType<'trl', 'get'> = {
			createdTimestamp: '',
			systemNumber: '',
			techRecord_bodyType_code: '',
			techRecord_couplingCenterToRearAxleMax: 0,
			techRecord_couplingCenterToRearAxleMin: 0,
			techRecord_couplingCenterToRearTrlMax: 0,
			techRecord_couplingCenterToRearTrlMin: 0,
			techRecord_couplingType: '',
			techRecord_createdAt: '',
			techRecord_createdById: '',
			techRecord_createdByName: '',
			techRecord_dimensions_length: 0,
			techRecord_dimensions_width: 0,
			techRecord_euVehicleCategory: undefined,
			techRecord_firstUseDate: '',
			techRecord_frontAxleToRearAxle: 0,
			techRecord_make: '',
			techRecord_maxLoadOnCoupling: 0,
			techRecord_model: '',
			techRecord_notes: '',
			techRecord_rearAxleToRearTrl: 0,
			techRecord_roadFriendly: false,
			techRecord_suspensionType: '',
			techRecord_tyreUseCode: undefined,
			techRecord_vehicleClass_code: 't',
			techRecord_vehicleConfiguration: undefined,
			trailerId: '',
			techRecord_vehicleType: 'trl',
			partialVin: '',
			techRecord_bodyType_description: '',
			techRecord_noOfAxles: 2,
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
			techRecord_vehicleClass_description: 'trailer',
			vin: '',
			techRecord_adrDetails_dangerousGoods: true,
		};
		const control = form.controls['euVehicleCategory'] as CustomFormControl;
		store.overrideSelector(techRecord, trlTechRecord);
		store.overrideSelector(selectTechRecord, trlTechRecord);
		await firstValueFrom(
			CustomAsyncValidators.filterEuCategoryOnVehicleType(
				techRecordService,
				routerService
			)(control) as Observable<ValidationErrors | null>
		);
		expect(control.meta.options).toEqual(TRL_EU_VEHICLE_CATEGORY_OPTIONS);
	});
});

describe('asyncRequired', () => {
	it('should return null if the control is not empty', async () => {
		const control = new CustomFormControl({ name: 'test', type: FormNodeTypes.CONTROL, children: [] }, null);
		control.patchValue('test');
		const result = await firstValueFrom(
			CustomAsyncValidators.asyncRequired()(control) as Observable<ValidationErrors | null>
		);
		expect(result).toBeNull();
	});
	it('should return a validation error if the control is empty', async () => {
		const control = new CustomFormControl({ name: 'test', type: FormNodeTypes.CONTROL, children: [] }, null);
		const result = await firstValueFrom(
			CustomAsyncValidators.asyncRequired()(control) as Observable<ValidationErrors | null>
		);
		expect(result).toEqual({ required: true });
	});
});

describe('passResultDependantOnCustomDefects', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			testResult: new CustomFormControl({ name: 'testResult', type: FormNodeTypes.CONTROL, children: [] }, null),
		});
	});

	it('should fail validation when value is "pass" and defects are present', async () => {
		form.controls['testResult'].patchValue('pass');

		const mockedTestResult = mockTestResult();
		mockedTestResult.testTypes[0].customDefects = [createMockCustomDefect()];
		store.overrideSelector(testResultInEdit, mockedTestResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.passResultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ invalidTestResult: { message: 'Cannot pass test when defects are present' } });
	});

	it('should pass validation when value is "fail" but no defects are present', async () => {
		form.controls['testResult'].patchValue('fail');

		const testResult = mockTestResult();
		testResult.testTypes = [];

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.passResultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should pass validation when value is "prs" but no defects are present', async () => {
		form.controls['testResult'].patchValue('prs');

		const testResult = mockTestResult();
		testResult.testTypes = [];

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.passResultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should pass validation when value is "abandoned"', async () => {
		form.controls['testResult'].patchValue('abandoned');

		store.overrideSelector(testResultInEdit, mockTestResult());

		const result = await firstValueFrom(
			CustomAsyncValidators.passResultDependantOnCustomDefects(store)(
				form.controls['testResult']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});
});

describe('updateTestStationDetails', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideMockStore({
					initialState: {
						...initialAppState,
						testStations: {
							...initialTestStationsState,
							ids: ['1'],
							entities: { 1: { testStationName: 'foo', testStationPNumber: '1234', testStationType: 'bar' } },
						},
					},
				}),
			],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			testStationName: new CustomFormControl(
				{ name: 'testStationName', type: FormNodeTypes.CONTROL, children: [] },
				null
			),
			testStationType: new CustomFormControl(
				{ name: 'testStationType', type: FormNodeTypes.CONTROL, children: [] },
				null
			),
			testStationPNumber: new CustomFormControl(
				{ name: 'testStationPNumber', type: FormNodeTypes.CONTROL, children: [] },
				null
			),
		});
	});
	it('should update the test stations details', async () => {
		form.controls['testStationPNumber'].patchValue('1234');
		expect(form.controls['testStationPNumber']).toBeTruthy();
		await firstValueFrom(
			CustomAsyncValidators.updateTestStationDetails(store)(form.controls['testStationPNumber']) as Observable<null>
		);
		expect(form.controls['testStationType'].value).toBe('bar');
		expect(form.controls['testStationName'].value).toBe('foo');
	});
});

describe('requiredIfNotFail', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
		});
	});

	it('should be required when value is "pass"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotFail(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotfail: true });
	});

	it('should pass validation if field is not empty when value is "pass"', async () => {
		form.controls['foo'].patchValue('test');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotFail(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should not be required when value is "fail"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.fail }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotFail(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should be required when value is "prs"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.prs }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotFail(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotfail: true });
	});

	it('should be required when value is "abandoned"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.abandoned }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotFail(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotfail: true });
	});
});

describe('requiredIfNotAbandoned', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
		});
	});

	it('should be required when value is "pass"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotAbandoned(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotabandoned: true });
	});

	it('should pass validation if field is not empty when value is "pass"', async () => {
		form.controls['foo'].patchValue('test');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotAbandoned(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should be required when value is "fail"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.fail }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotAbandoned(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotabandoned: true });
	});

	it('should be required when value is "prs"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.prs }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotAbandoned(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotabandoned: true });
	});

	it('should not be required when value is "abandoned"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.abandoned }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotAbandoned(store)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});
});

describe('requiredIfNotResult', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
		});
	});

	it('should be required when result is "pass" and validator specifies requiredIfNotResult "fail"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResult(
				store,
				resultOfTestEnum.fail
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotfail: true });
	});

	it('should be required when result is "pass" and validator specifies requiredIfNotResult "fail" or "abandoned"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResult(store, [resultOfTestEnum.fail, resultOfTestEnum.abandoned])(
				form.controls['foo']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotResult: true });
	});

	it('should pass validation if field is not empty when value is "pass" and validator specifies requiredIfNotResult "fail"', async () => {
		form.controls['foo'].patchValue('test');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResult(
				store,
				resultOfTestEnum.fail
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should not be required when value is "fail" and validator specifies requiredIfNotResult "fail"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.fail }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResult(
				store,
				resultOfTestEnum.fail
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should be required when value is "prs" and validator specifies requiredIfNotResult "fail"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.prs }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResult(
				store,
				resultOfTestEnum.fail
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotfail: true });
	});

	it('should be required when value is "abandoned" and validator specifies requiredIfNotResult "fail"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.abandoned }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResult(
				store,
				resultOfTestEnum.fail
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotfail: true });
	});

	it('should be required when value is "abandoned" and validator specifies requiredIfNotResult "fail" or "pass"', async () => {
		form.controls['foo'].patchValue('');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.abandoned }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResult(store, [resultOfTestEnum.fail, resultOfTestEnum.pass])(
				form.controls['foo']
			) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotResult: true });
	});
});

describe('requiredIfNotResultAndSiblingEquals', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
			bar: new CustomFormControl({ name: 'bar', type: FormNodeTypes.CONTROL, children: [] }, null),
		});
	});

	it('should be required when result is "pass" and "bar is "x" and ' +
		'validator specifies requiredIfNotResultAndSiblingEquals "fail" when sibling "bar" is "x"', async () => {
		form.controls['foo'].patchValue('');
		form.controls['bar'].patchValue('x');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResultAndSiblingEquals(
				store,
				resultOfTestEnum.fail,
				'bar',
				'x'
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotResultAndSiblingEquals: true });
	});

	it('should pass validation when result is "fail" and "bar is "x" and ' +
		'validator specifies requiredIfNotResultAndSiblingEquals "fail" when sibling "bar" is "x"', async () => {
		form.controls['foo'].patchValue('');
		form.controls['bar'].patchValue('x');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.fail }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResultAndSiblingEquals(
				store,
				resultOfTestEnum.fail,
				'bar',
				'x'
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should pass validation when result is "pass" and "bar is "y" and ' +
		'validator specifies requiredIfNotResultAndSiblingEquals "fail" when sibling "bar" is "x"', async () => {
		form.controls['foo'].patchValue('');
		form.controls['bar'].patchValue('y');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResultAndSiblingEquals(
				store,
				resultOfTestEnum.fail,
				'bar',
				'x'
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toBeNull();
	});

	it('should be required when result is "pass" and "bar is "x" and ' +
		'validator specifies requiredIfNotResultAndSiblingEquals "fail"/"abandoned" when sibling "bar" is "x"', async () => {
		form.controls['foo'].patchValue('');
		form.controls['bar'].patchValue('x');

		const testResult = { testTypes: [{ testResult: resultOfTestEnum.pass }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		const result = await firstValueFrom(
			CustomAsyncValidators.requiredIfNotResultAndSiblingEquals(
				store,
				[resultOfTestEnum.fail, resultOfTestEnum.abandoned],
				'bar',
				'x'
			)(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect(result).toEqual({ requiredIfNotResultAndSiblingEquals: true });
	});
});

describe('hide if equals with condition', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
			bar: new CustomFormControl({ name: 'bar', type: FormNodeTypes.CONTROL, children: [] }, null),
		});
	});

	it('"bar" should be hidden when "foo" is "x" and testTypeId is "1" and ' +
		'validator specifies hideIfEqualsWithCondition for current field equals "x" with the condition that the ' +
		'"testTypeId" field has a value in "1,2,3,4"', async () => {
		form.controls['foo'].patchValue('x');

		const testResult = { testTypes: [{ testTypeId: '1' }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		await firstValueFrom(
			CustomAsyncValidators.hideIfEqualsWithCondition(store, 'bar', 'x', {
				field: 'testTypeId',
				operator: operatorEnum.Equals,
				value: ['1', '2', '3', '4'],
			})(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect((form.controls['bar'] as CustomFormControl).meta.hide).toBe(true);
	});

	it('"bar" should not be hidden when "foo" is "x" and testTypeId is "1" and ' +
		'validator specifies hideIfEqualsWithCondition for current field equals "y" with ' +
		'the condition that the "testTypeId" field has a value in "1,2,3,4"', async () => {
		form.controls['foo'].patchValue('x');

		const testResult = { testTypes: [{ testTypeId: '1' }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		await firstValueFrom(
			CustomAsyncValidators.hideIfEqualsWithCondition(store, 'bar', 'y', {
				field: 'testTypeId',
				operator: operatorEnum.Equals,
				value: ['1', '2', '3', '4'],
			})(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect((form.controls['bar'] as CustomFormControl).meta.hide).toBe(false);
	});

	it('"bar" should not be hidden when "foo" is "x" and testTypeId is "5" and ' +
		'validator specifies hideIfEqualsWithCondition for current field equals "x" with ' +
		'the condition that the "testTypeId" field has a value in "1,2,3,4"', async () => {
		form.controls['foo'].patchValue('x');

		const testResult = { testTypes: [{ testTypeId: '5' }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		await firstValueFrom(
			CustomAsyncValidators.hideIfEqualsWithCondition(store, 'bar', 'x', {
				field: 'testTypeId',
				operator: operatorEnum.Equals,
				value: ['1', '2', '3', '4'],
			})(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect((form.controls['bar'] as CustomFormControl).meta.hide).toBe(false);
	});

	it('"bar" should be hidden when "foo" is "x" and testTypeId is "1" and "odometerReading" is 100 and ' +
		'validator specifies hideIfEqualsWithCondition for current field equals "x" with the condition that the ' +
		'"testTypeId" field has a value in "1,2,3,4" and "odometerReading" is 100', async () => {
		form.controls['foo'].patchValue('x');

		const testResult = { odometerReading: 100, testTypes: [{ testTypeId: '1' }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		await firstValueFrom(
			CustomAsyncValidators.hideIfEqualsWithCondition(store, 'bar', 'x', [
				{ field: 'testTypeId', operator: operatorEnum.Equals, value: ['1', '2', '3', '4'] },
				{ field: 'odometerReading', operator: operatorEnum.Equals, value: 100 },
			])(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect((form.controls['bar'] as CustomFormControl).meta.hide).toBe(true);
	});

	it('"bar" should not be hidden when "foo" is "x" and testTypeId is "1" and "odometerReading" is 101 and ' +
		'validator specifies hideIfEqualsWithCondition for current field equals "x" with the condition that the "testTypeId" ' +
		'field has a value in "1,2,3,4" and "odometerReading" is 100', async () => {
		form.controls['foo'].patchValue('x');

		const testResult = { odometerReading: 101, testTypes: [{ testTypeId: '1' }] } as TestResultModel;

		store.overrideSelector(testResultInEdit, testResult);

		await firstValueFrom(
			CustomAsyncValidators.hideIfEqualsWithCondition(store, 'bar', 'x', [
				{ field: 'testTypeId', operator: operatorEnum.Equals, value: ['1', '2', '3', '4'] },
				{ field: 'odometerReading', operator: operatorEnum.Equals, value: 100 },
			])(form.controls['foo']) as Observable<ValidationErrors | null>
		);

		expect((form.controls['bar'] as CustomFormControl).meta.hide).toBe(false);
	});
});

describe('requiredWhenCarryingDangerousGoods', () => {
	let form: FormGroup;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);

		form = new FormGroup({
			techRecord_make: new CustomFormControl(
				{
					name: 'techRecord_make',
					type: FormNodeTypes.CONTROL,
					children: [],
				},
				null
			),
			techRecord_adrDetails_dangerousGoods: new CustomFormControl(
				{
					name: 'techRecord_adrDetails_dangerousGoods',
					type: FormNodeTypes.CONTROL,
					children: [],
				},
				null
			),
		});
	});
	it('should return null if the vehicle is not of type HGV or TRL', async () => {
		// Not applicable tech record vehicle type
		const carTechRecord: TechRecordType<'car', 'put'> = {
			techRecord_vehicleType: 'car',
			vin: 'car',
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
		};

		store.overrideSelector(editingTechRecord, carTechRecord);

		const result = CustomAsyncValidators.requiredWhenCarryingDangerousGoods(store)(
			form.get('techRecord_make') as AbstractControl
		);
		await expect(lastValueFrom(result)).resolves.toBeNull();
	});

	it('should return null if the control is populated', async () => {
		// Applicable vehicle tech record type
		const hgvTechRecord: TechRecordType<'hgv', 'put'> = {
			techRecord_vehicleType: 'hgv',
			partialVin: '',
			techRecord_bodyType_description: '',
			techRecord_noOfAxles: 2,
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
			techRecord_vehicleClass_description: 'heavy goods vehicle',
			primaryVrm: '',
			vin: '',

			// Vehicle does carry dangerous goods
			techRecord_adrDetails_dangerousGoods: true,
		};

		// ...but the control is populated
		form.get('techRecord_make')?.patchValue('make');

		store.overrideSelector(editingTechRecord, hgvTechRecord);

		const result = CustomAsyncValidators.requiredWhenCarryingDangerousGoods(store)(
			form.get('techRecord_make') as AbstractControl
		);
		await expect(lastValueFrom(result)).resolves.toBeNull();
	});

	it('should return null if the vehicle is an ADR vehicle, but does not carry dangerous goods', async () => {
		// Applicable vehicle tech record type
		const hgvTechRecord: TechRecordType<'hgv', 'put'> = {
			techRecord_vehicleType: 'hgv',
			partialVin: '',
			techRecord_bodyType_description: '',
			techRecord_noOfAxles: 2,
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
			techRecord_vehicleClass_description: 'heavy goods vehicle',
			primaryVrm: '',
			vin: '',

			// Vehicle doesn't carry dangerous goods
			techRecord_adrDetails_dangerousGoods: false,
		};

		// ...and the control isn't populated
		form.get('techRecord_make')?.patchValue(null);

		store.overrideSelector(editingTechRecord, hgvTechRecord);

		const result = CustomAsyncValidators.requiredWhenCarryingDangerousGoods(store)(
			form.get('techRecord_make') as AbstractControl
		);
		await expect(lastValueFrom(result)).resolves.toBeNull();
	});

	it('should return the required validation error when the vehicle is an ADR vehicle, and carries dangerous goods is selected', async () => {
		// Applicable vehicle tech record type
		const hgvTechRecord: TechRecordType<'hgv', 'put'> = {
			techRecord_vehicleType: 'hgv',
			partialVin: '',
			techRecord_bodyType_description: '',
			techRecord_noOfAxles: 2,
			techRecord_reasonForCreation: 'test',
			techRecord_statusCode: 'provisional',
			techRecord_vehicleClass_description: 'heavy goods vehicle',
			primaryVrm: '',
			vin: '',

			// Vehicle does carry dangerous goods
			techRecord_adrDetails_dangerousGoods: true,
		};

		// ...and the control isn't populated
		form.get('techRecord_make')?.patchValue(null);

		store.overrideSelector(editingTechRecord, hgvTechRecord);

		const result = CustomAsyncValidators.requiredWhenCarryingDangerousGoods(store)(
			form.get('techRecord_make') as AbstractControl
		);
		await expect(lastValueFrom(result)).resolves.toStrictEqual({ required: true });
	});
});
