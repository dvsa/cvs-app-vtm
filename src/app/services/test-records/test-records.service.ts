import { Injectable, inject } from '@angular/core';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { masterTpl } from '@forms/templates/test-records/master.template';
import {
	TEST_TYPES,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP5_SPEC_TEST,
} from '@models/testTypeId.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { HttpService } from '@services/http/http.service';
import {
	cancelEditingTestResult,
	cleanTestResult,
	contingencyTestTypeSelected,
	createTestResult,
	editingTestResult,
	fetchTestResults,
	fetchTestResultsBySystemNumber,
	isTestTypeKeySame,
	sectionTemplates,
	selectAllTestResults,
	selectAmendedDefectData,
	selectDefectData,
	selectedAmendedTestResultState,
	selectedTestResultState,
	testResultInEdit,
	testTypeIdChanged,
	toEditOrNotToEdit,
	updateEditingTestResult,
	updateTestResult,
	updateTestResultFailed,
} from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { Observable, take, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TestRecordsService {
	private store = inject(Store);
	private httpService = inject(HttpService);

	testResult$ = this.store.pipe(select(selectedTestResultState));
	editingTestResult$ = this.store.pipe(select(testResultInEdit));
	testRecords$ = this.store.pipe(select(selectAllTestResults));
	defectData$ = this.store.pipe(select(selectDefectData));
	amendedTestResult$ = this.store.pipe(select(selectedAmendedTestResultState));
	amendedDefectData$ = this.store.pipe(select(selectAmendedDefectData));
	sectionTemplates$ = this.store.pipe(select(sectionTemplates));
	isSameTestTypeId$ = this.store.pipe(select(isTestTypeKeySame('testTypeId')));
	isTestTypeGroupEditable$ = this.store.pipe(select(toEditOrNotToEdit), this.canHandleTestType(masterTpl));
	canCreate$ = this.store.pipe(select(toEditOrNotToEdit), this.canHandleTestType(contingencyTestTemplates));

	fetchTestResultbySystemNumber(
		systemNumber: string,
		queryparams: {
			status?: string;
			fromDateTime?: Date;
			toDateTime?: Date;
			testResultId?: string;
			version?: string;
		} = {}
	): Observable<Array<TestResultSchema>> {
		if (!systemNumber) {
			return throwError(() => new Error('systemNumber is required'));
		}

		const { status, fromDateTime, toDateTime, testResultId, version } = queryparams;
		return this.httpService.testResultsSystemNumberGet(
			systemNumber,
			status,
			fromDateTime,
			toDateTime,
			testResultId,
			version
		) as Observable<Array<TestResultSchema>>;
	}

	loadTestResults(): void {
		this.store.dispatch(fetchTestResults());
	}

	isTestTypeFirstTest(testTypeId: string): boolean {
		const firstTestIds = ['41', '95', '65', '66', '67', '103', '104', '82', '83', '119', '120'];
		return firstTestIds.includes(testTypeId);
	}

	loadTestResultBySystemNumber(systemNumber: string): void {
		this.store.dispatch(fetchTestResultsBySystemNumber({ systemNumber }));
	}

	saveTestResult(
		systemNumber: string,
		user: { name: string; id?: string; userEmail?: string },
		body: TestResultSchema
	): Observable<TestResultSchema> {
		const { name, id, userEmail } = user;
		const tr = cloneDeep(body);
		delete tr.testHistory;
		return this.httpService.testResultsSystemNumberPut(
			// @TODO: correctly type
			{ msUserDetails: { msOid: id, msUser: name, msEmailAddress: userEmail }, testResult: tr } as any,
			systemNumber
		) as Observable<TestResultSchema>;
	}

	updateTestResult(value: TestResultSchema): void {
		this.store.dispatch(updateTestResult({ value }));
	}

	postTestResult(body: TestResultSchema) {
		return this.httpService.testResultsPost(body as TestResultSchema);
	}

	createTestResult(value: TestResultSchema): void {
		this.store.dispatch(createTestResult({ value }));
	}

	cleanTestResult() {
		return this.store.dispatch(cleanTestResult());
	}

	prepareTestResultForAmendment(testResults: TestResultSchema[], testResult: TestResultSchema): TestResultSchema {
		const lastIvaOrMsvaTest = testResults.find((test) => {
			const testType = test?.testTypes[0];
			const testTypeId = testType?.testTypeId ?? '';
			const isIVAorMSVATest =
				TEST_TYPES_GROUP1_SPEC_TEST.includes(testTypeId) || TEST_TYPES_GROUP5_SPEC_TEST.includes(testTypeId);

			return isIVAorMSVATest;
		});

		// For failed TIR tests, set the certifcate number to null to pass BE validation
		if (
			TEST_TYPES_GROUP5_13.includes(testResult.testTypes[0].testTypeId) &&
			testResult.testTypes[0].testResult === 'fail' &&
			!testResult.testTypes[0].certificateNumber
		) {
			testResult.testTypes[0].certificateNumber = null as unknown as string;
		}

		if (!lastIvaOrMsvaTest) {
			return testResult;
		}

		// If certificateNumber is falsy, then use the last IVA or MSVA test certificate number
		testResult.testTypes[0].certificateNumber ??= lastIvaOrMsvaTest.testTypes[0].certificateNumber;

		return testResult;
	}

	static getTestTypeGroup(testTypeId: string): string | undefined {
		// eslint-disable-next-line no-restricted-syntax
		for (const groupName in TEST_TYPES) {
			if (TEST_TYPES[groupName as keyof typeof TEST_TYPES].includes(testTypeId)) {
				return groupName;
			}
		}
		return undefined;
	}

	editingTestResult(testResult: TestResultSchema): void {
		this.store.dispatch(editingTestResult({ testTypeId: testResult.testTypes[0].testTypeId }));
	}

	cancelEditingTestResult(): void {
		this.store.dispatch(cancelEditingTestResult());
	}

	updateEditingTestResult(testResult: TestResultSchema): void {
		this.store.dispatch(updateEditingTestResult({ testResult }));
	}

	testTypeChange(testTypeId: string) {
		this.store.dispatch(testTypeIdChanged({ testTypeId }));
	}

	private canHandleTestType(templateMap: Record<VehicleTypes, Record<string, Record<string, FormNode>>>) {
		return function handleTestType<T>(source: Observable<T>): Observable<boolean> {
			const handle = (testResult: TestResultSchema | undefined): boolean => {
				if (!testResult) {
					return false;
				}

				const { vehicleType } = testResult;
				const testTypeId = testResult.testTypes && testResult.testTypes[0].testTypeId;
				const testTypeGroup = TestRecordsService.getTestTypeGroup(testTypeId);
				const vehicleTpl = vehicleType && templateMap[`${vehicleType}`];

				return !!testTypeGroup && !!vehicleTpl && Object.prototype.hasOwnProperty.call(vehicleTpl, testTypeGroup);
			};

			return new Observable((subscriber) => {
				source.subscribe({
					next: (val) => {
						subscriber.next(handle(val as unknown as TestResultSchema));
					},
					error: (e) => subscriber.error(e),
					complete: () => subscriber.complete(),
				});
			});
		};
	}

	contingencyTestTypeSelected(testType: string) {
		this.store.dispatch(contingencyTestTypeSelected({ testType }));
	}

	cancelTest(reason: string): void {
		this.store.pipe(select(toEditOrNotToEdit), take(1)).subscribe((testResult) => {
			if (!testResult) {
				return this.store.dispatch(updateTestResultFailed({ errors: [{ error: 'No selected test result.' }] }));
			}

			const cancelledTest = { ...testResult, testStatus: TestStatus.CANCELLED, reasonForCancellation: reason };

			this.store.dispatch(updateTestResult({ value: cancelledTest }));
		});
	}
}
